const { Readable } = require("node:stream");
const fs = require("node:fs");
const path = require("node:path");

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024;
const MAX_MULTIPART_BODY_BYTES = MAX_FILE_SIZE_BYTES + 1024 * 1024;
const DEFAULT_CLOUDINARY_UPLOAD_TIMEOUT_MS = 15000;

const uploadsDir = path.join(__dirname, "../../uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

async function saveToDisk(file, kind, userId, req) {
  const ext = path.extname(file.name) || (getResourceType(file) === "image" ? ".jpg" : ".bin");
  const filename = `${kind}-${userId}-${Date.now()}${ext}`;
  const filePath = path.join(uploadsDir, filename);
  const arrayBuffer = await file.arrayBuffer();
  fs.writeFileSync(filePath, Buffer.from(arrayBuffer));

  const host = req.get("host") || "localhost:4000";
  const protocol = req.protocol || "http";
  const fullUrl = `${protocol}://${host}/uploads/${filename}`;

  return {
    kind,
    publicId: filename,
    resourceType: getResourceType(file),
    url: fullUrl,
    bytes: file.size,
    width: null,
    height: null,
    originalFilename: file.name,
  };
}

function getUploadKind(value) {
  const normalized = String(value || "").trim().toLowerCase();

  if (normalized === "avatar" || normalized === "cover" || normalized === "video") {
    return normalized;
  }

  return "upload";
}

function getResourceType(file) {
  const mimeType = String(file.type || "").toLowerCase();

  if (mimeType.startsWith("image/")) {
    return "image";
  }

  if (mimeType.startsWith("video/") || mimeType.startsWith("audio/")) {
    return "video";
  }

  return "raw";
}

function getFolder(kind) {
  switch (kind) {
    case "avatar":
      return "extremis/avatars";
    case "cover":
      return "extremis/covers";
    case "video":
      return "extremis/videos";
    default:
      return "extremis/uploads";
  }
}

function setStatus(error, statusCode) {
  error.statusCode = statusCode;
  return error;
}

function toPositiveInteger(value, fallback) {
  const parsed = Number.parseInt(String(value || ""), 10);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    return fallback;
  }

  return parsed;
}

function getContentLength(req) {
  const rawHeader = req.headers["content-length"];
  const value = Array.isArray(rawHeader) ? rawHeader[0] : rawHeader;
  const parsed = Number.parseInt(String(value || ""), 10);

  if (!Number.isFinite(parsed) || parsed <= 0) {
    return null;
  }

  return parsed;
}

function isUploadFile(value) {
  return Boolean(
    value &&
      typeof value === "object" &&
      typeof value.arrayBuffer === "function" &&
      typeof value.name === "string"
  );
}

function createHeaders(headerMap) {
  const headers = new Headers();

  Object.entries(headerMap).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach((entry) => headers.append(key, entry));
      return;
    }

    if (typeof value === "string") {
      headers.set(key, value);
    }
  });

  return headers;
}

async function readMultipartFormData(req) {
  const contentType = String(req.headers["content-type"] || "").toLowerCase();
  if (!contentType.includes("multipart/form-data")) {
    throw setStatus(new Error("Content-Type must be multipart/form-data."), 400);
  }

  const request = new Request("http://localhost/api/uploads", {
    method: req.method,
    headers: createHeaders(req.headers),
    body: Readable.toWeb(req),
    duplex: "half",
  });

  try {
    return await request.formData();
  } catch {
    throw setStatus(new Error("Invalid multipart form data."), 400);
  }
}

async function uploadFile(req, res, next) {
  try {
    const userId = req.user?._id ? String(req.user._id) : null;
    if (!userId) {
      res.status(401).json({ message: "Authentication required." });
      return;
    }

    const cloudName = String(process.env.CLOUDINARY_CLOUD_NAME || "").trim();
    const apiKey = String(process.env.CLOUDINARY_API_KEY || "").trim();
    const apiSecret = String(process.env.CLOUDINARY_API_SECRET || "").trim();

    if (!cloudName || !apiKey || !apiSecret) {
      res.status(500).json({ message: "Cloudinary environment variables are missing." });
      return;
    }

    const contentLength = getContentLength(req);
    if (contentLength && contentLength > MAX_MULTIPART_BODY_BYTES) {
      res.status(413).json({ message: "Files must be 10MB or smaller." });
      return;
    }

    const formData = await readMultipartFormData(req);
    const file = formData.get("file");
    const kind = getUploadKind(formData.get("kind"));

    if (!isUploadFile(file)) {
      res.status(400).json({ message: "A file is required." });
      return;
    }

    if (file.size <= 0) {
      res.status(400).json({ message: "The selected file is empty." });
      return;
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      res.status(413).json({ message: "Files must be 10MB or smaller." });
      return;
    }

    const resourceType = getResourceType(file);
    const uploadBody = new FormData();
    uploadBody.append("file", file, file.name);
    uploadBody.append("folder", getFolder(kind));
    uploadBody.append("public_id", `${kind}-${userId}-${Date.now()}`);
    const timeoutMs = toPositiveInteger(
      process.env.CLOUDINARY_UPLOAD_TIMEOUT_MS,
      DEFAULT_CLOUDINARY_UPLOAD_TIMEOUT_MS
    );
    const abortController = new AbortController();
    const timeoutHandle = setTimeout(() => {
      abortController.abort();
    }, timeoutMs);

    let response;
    try {
      response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`,
        {
          method: "POST",
          headers: {
            Authorization: `Basic ${Buffer.from(`${apiKey}:${apiSecret}`).toString("base64")}`,
          },
          body: uploadBody,
          cache: "no-store",
          signal: abortController.signal,
        }
      );
    } catch (error) {
      clearTimeout(timeoutHandle);
      // If Cloudinary fails or times out, seamlessly fallback to local disk storage
      const fallbackResult = await saveToDisk(file, kind, userId, req);
      res.status(200).json(fallbackResult);
      return;
    } finally {
      clearTimeout(timeoutHandle);
    }

    const payload = await response
      .json()
      .catch(() => ({}));

    if (!response.ok || !payload.secure_url || !payload.public_id || !payload.resource_type) {
      // Cloudinary error fallback to disk
      const fallbackResult = await saveToDisk(file, kind, userId, req);
      res.status(200).json(fallbackResult);
      return;
    }

    res.status(200).json({
      kind,
      publicId: payload.public_id,
      resourceType: payload.resource_type,
      url: payload.secure_url,
      bytes: payload.bytes || file.size,
      width: payload.width ?? null,
      height: payload.height ?? null,
      originalFilename: payload.original_filename || file.name,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  uploadFile,
};
