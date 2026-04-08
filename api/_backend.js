const loadEnv = require("../backend/src/config/loadEnv");
loadEnv();

const app = require("../backend/src/app");
const connectDB = require("../backend/src/config/db");
const DEFAULT_CLIENT_ORIGINS = [
  "https://www.extremis.top",
  "https://extremis.top",
  "http://localhost:3000",
  "http://127.0.0.1:3000",
];

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

const allowedOrigins = Array.from(
  new Set(
    [
      ...DEFAULT_CLIENT_ORIGINS,
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

function applyCorsHeaders(req, res) {
  const requestOrigin = String(req.headers.origin || "").trim();

  if (!requestOrigin) {
    return { allowed: true, origin: null };
  }

  const normalizedOrigin = normalizeOrigin(requestOrigin);
  if (!normalizedOrigin) {
    return { allowed: false, origin: null };
  }

  const isAllowed = allowedOrigins.length === 0 || allowedOrigins.includes(normalizedOrigin);
  if (!isAllowed) {
    return { allowed: false, origin: normalizedOrigin };
  }

  const requestedHeaders = String(req.headers["access-control-request-headers"] || "").trim();

  res.setHeader("Access-Control-Allow-Origin", normalizedOrigin);
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE,OPTIONS");
  res.setHeader(
    "Access-Control-Allow-Headers",
    requestedHeaders || "Authorization,Content-Type,X-Requested-With"
  );
  res.setHeader("Access-Control-Max-Age", "86400");
  res.setHeader("Vary", "Origin");

  return { allowed: true, origin: normalizedOrigin };
}

function normalizePrefix(prefix) {
  if (!prefix) {
    return "";
  }

  return prefix.startsWith("/") ? prefix : `/${prefix}`;
}

function buildRequestUrl(req, prefix = "") {
  const protocol = String(req.headers["x-forwarded-proto"] || "https");
  const host = String(req.headers.host || "localhost");
  const url = new URL(req.url || "/", `${protocol}://${host}`);
  let pathname = url.pathname;
  const normalizedPrefix = normalizePrefix(prefix);

  if (pathname === "/api") {
    pathname = "/";
  } else if (pathname.startsWith("/api/")) {
    pathname = pathname.slice(4);
  }

  if (!pathname.startsWith("/")) {
    pathname = `/${pathname}`;
  }

  if (
    normalizedPrefix &&
    pathname !== normalizedPrefix &&
    !pathname.startsWith(`${normalizedPrefix}/`)
  ) {
    pathname = pathname === "/" ? normalizedPrefix : `${normalizedPrefix}${pathname}`;
  }

  return `${pathname}${url.search}`;
}

async function forwardToBackend(req, res, options = {}) {
  const corsState = applyCorsHeaders(req, res);

  if (!corsState.allowed) {
    res.status(403).json({
      message: "Origin not allowed by CORS.",
    });
    return;
  }

  if (req.method === "OPTIONS") {
    res.status(204).end();
    return;
  }

  try {
    req.url = buildRequestUrl(req, options.prefix);
    await connectDB();
    return app(req, res);
  } catch (error) {
    console.error("Vercel API error:", error);

    if (!res.headersSent) {
      res.status(500).json({
        message: error?.expose && error?.message ? error.message : "Internal server error.",
      });
    }
  }
}

module.exports = {
  forwardToBackend,
};
