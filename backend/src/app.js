const cors = require("cors");
const express = require("express");
const authRoutes = require("./routes/authRoutes");
const chatRoutes = require("./routes/chatRoutes");
const postRoutes = require("./routes/postRoutes");
const profileRoutes = require("./routes/profileRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
const { notFound, errorHandler } = require("./middleware/errorHandler");

const app = express();
const apiRouter = express.Router();

function normalizeOrigin(origin) {
  const normalized = String(origin || "").trim();
  if (!normalized) {
    return null;
  }

  try {
    const value = normalized.includes("://") ? normalized : `https://${normalized}`;
    return new URL(value).origin.toLowerCase();
  } catch {
    return null;
  }
}

function stripWwwPrefix(host) {
  return String(host || "")
    .trim()
    .toLowerCase()
    .replace(/^www\./, "");
}

function getRequestHost(req) {
  return String(req.headers["x-forwarded-host"] || req.headers.host || "")
    .trim()
    .toLowerCase();
}

function isWwwSiblingHost(firstHost, secondHost) {
  return Boolean(firstHost && secondHost) && stripWwwPrefix(firstHost) === stripWwwPrefix(secondHost);
}

const allowedOrigins = Array.from(
  new Set(
    [
      ...String(process.env.CLIENT_ORIGIN || "").split(","),
      process.env.NEXT_PUBLIC_SITE_URL,
      process.env.VERCEL_PROJECT_PRODUCTION_URL,
      process.env.VERCEL_URL,
    ]
      .map((origin) => normalizeOrigin(origin))
      .filter(Boolean)
      .flatMap((origin) => {
        try {
          const parsed = new URL(origin);
          const variants = [parsed.origin];

          if (parsed.hostname.startsWith("www.")) {
            variants.push(`${parsed.protocol}//${parsed.hostname.replace(/^www\./, "")}`);
          } else {
            variants.push(`${parsed.protocol}//www.${parsed.hostname}`);
          }

          return variants;
        } catch {
          return [origin];
        }
      })
  )
);

function isSameOriginRequest(req, origin) {
  try {
    const originUrl = new URL(origin);
    const requestHost = getRequestHost(req);
    return Boolean(requestHost) && isWwwSiblingHost(originUrl.host, requestHost);
  } catch {
    return false;
  }
}

app.use((req, res, next) => {
  cors({
    origin(origin, callback) {
      if (!origin) {
        callback(null, true);
        return;
      }

      const normalizedOrigin = normalizeOrigin(origin);
      if (!normalizedOrigin) {
        const error = new Error("Origin is not a valid URL.");
        error.statusCode = 403;
        error.expose = true;
        callback(error);
        return;
      }

      if (
        allowedOrigins.length === 0 ||
        allowedOrigins.includes(normalizedOrigin) ||
        isSameOriginRequest(req, normalizedOrigin)
      ) {
        callback(null, true);
        return;
      }

      const error = new Error("Origin not allowed by CORS.");
      error.statusCode = 403;
      error.expose = true;
      callback(error);
    },
    credentials: true,
  })(req, res, next);
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
  if (req.body == null) {
    req.body = {};
    next();
    return;
  }

  if (Buffer.isBuffer(req.body)) {
    try {
      req.body = JSON.parse(req.body.toString("utf8"));
    } catch {
      req.body = {};
    }

    next();
    return;
  }

  if (typeof req.body === "string") {
    const rawBody = req.body.trim();
    if (!rawBody) {
      req.body = {};
      next();
      return;
    }

    try {
      req.body = JSON.parse(rawBody);
    } catch {
      req.body = {};
    }
  }

  next();
});

apiRouter.get("/health", (req, res) => {
  res.status(200).json({
    ok: true,
    service: "auth-api",
    timestamp: new Date().toISOString(),
  });
});

apiRouter.use("/auth", authRoutes);
apiRouter.use("/chat", chatRoutes);
apiRouter.use("/posts", postRoutes);
apiRouter.use("/profile", profileRoutes);
apiRouter.use("/uploads", uploadRoutes);

// Support both direct server mounts (/api/* locally) and stripped Vercel function paths.
app.use("/api", apiRouter);
app.use(apiRouter);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
