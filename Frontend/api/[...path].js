const { forwardToBackend } = require("./_backend");

// Keep all backend endpoints behind a single Vercel Function so
// /api/auth/*, /api/chat/*, /api/posts/*, /api/profile/*, and /api/uploads
// continue to work without exceeding the Hobby plan function limit.
module.exports = async (req, res) => forwardToBackend(req, res);
