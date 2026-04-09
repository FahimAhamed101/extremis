const { forwardToBackend } = require("../_backend");

module.exports = async (req, res) => {
  const protocol = String(req.headers["x-forwarded-proto"] || "https");
  const host = String(req.headers.host || "localhost");
  const url = new URL(req.url || "/", `${protocol}://${host}`);

  req.url = `/posts/feed${url.search}`;
  return forwardToBackend(req, res);
};
