const { forwardToBackend } = require("../_backend");

module.exports = async (req, res) => forwardToBackend(req, res, { prefix: "/uploads" });
