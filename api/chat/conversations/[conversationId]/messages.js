const { forwardToBackend } = require("../../../_backend");

function getConversationId(req, url) {
  const fromQuery = String(req.query?.conversationId || "").trim();
  if (fromQuery) {
    return fromQuery;
  }

  const pathname = String(url?.pathname || "");
  const match = pathname.match(/\/api\/chat\/conversations\/([^/]+)\/messages\/?$/i);
  return match?.[1] ? String(match[1]).trim() : "";
}

module.exports = async (req, res) => {
  const protocol = String(req.headers["x-forwarded-proto"] || "https");
  const host = String(req.headers.host || "localhost");
  const url = new URL(req.url || "/", `${protocol}://${host}`);
  const conversationId = getConversationId(req, url);

  req.url = `/chat/conversations/${conversationId}/messages${url.search}`;
  return forwardToBackend(req, res);
};
