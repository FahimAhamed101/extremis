const { forwardToBackend } = require("../../api/_backend");

module.exports = async (req, res) => {
  return forwardToBackend(req, res);
};

