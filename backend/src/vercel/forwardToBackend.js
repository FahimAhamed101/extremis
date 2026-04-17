const loadEnv = require("../config/loadEnv");
loadEnv();

const app = require("../app");
const connectDB = require("../config/db");

function applyCorsHeaders(req, res) {
  const requestOrigin = String(req.headers.origin || "").trim();
  const requestedHeaders = String(req.headers["access-control-request-headers"] || "").trim();

  if (requestOrigin) {
    res.setHeader("Access-Control-Allow-Origin", requestOrigin);
    res.setHeader("Vary", "Origin");
  } else {
    res.setHeader("Access-Control-Allow-Origin", "*");
  }
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE,OPTIONS");
  res.setHeader(
    "Access-Control-Allow-Headers",
    requestedHeaders || "Authorization,Content-Type,X-Requested-With"
  );
  res.setHeader("Access-Control-Max-Age", "86400");
}

function buildRequestUrl(req) {
  const protocol = String(req.headers["x-forwarded-proto"] || "https");
  const host = String(req.headers.host || "localhost");
  const url = new URL(req.url || "/", `${protocol}://${host}`);
  let pathname = url.pathname;

  if (pathname === "/api") {
    pathname = "/";
  } else if (pathname.startsWith("/api/")) {
    pathname = pathname.slice(4);
  }

  if (!pathname.startsWith("/")) {
    pathname = `/${pathname}`;
  }

  return `${pathname}${url.search}`;
}

function isHealthRequest(url) {
  const pathname = String(url || "").split("?", 1)[0];
  return pathname === "/health" || pathname === "/health/";
}

async function forwardToBackend(req, res) {
  applyCorsHeaders(req, res);

  if (req.method === "OPTIONS") {
    res.status(204).end();
    return;
  }

  try {
    req.url = buildRequestUrl(req);

    if (!isHealthRequest(req.url)) {
      await connectDB();
    }

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
