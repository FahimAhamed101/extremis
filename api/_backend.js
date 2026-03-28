const loadEnv = require("../backend/src/config/loadEnv");
loadEnv();

const app = require("../backend/src/app");
const connectDB = require("../backend/src/config/db");

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
