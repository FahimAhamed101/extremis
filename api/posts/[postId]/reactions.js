const { forwardToBackend } = require("../../_backend");

function getPostId(req, url) {
  const fromQuery = String(req.query?.postId || "").trim();
  if (fromQuery) {
    return fromQuery;
  }

  const pathname = String(url?.pathname || "");
  const match = pathname.match(/\/api\/posts\/([^/]+)\/reactions\/?$/i);
  return match?.[1] ? String(match[1]).trim() : "";
}

module.exports = async (req, res) => {
  const protocol = String(req.headers["x-forwarded-proto"] || "https");
  const host = String(req.headers.host || "localhost");
  const url = new URL(req.url || "/", `${protocol}://${host}`);
  const postId = getPostId(req, url);

  req.url = `/posts/${postId}/reactions${url.search}`;
  return forwardToBackend(req, res);
};
