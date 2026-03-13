function notFound(req, res) {
  res.status(404).json({ message: "Endpoint not found." });
}

function errorHandler(err, req, res, next) {
  if (res.headersSent) {
    next(err);
    return;
  }

  console.error(err);
  const explicitStatus = Number(err?.statusCode || err?.status);
  const statusCode =
    Number.isInteger(explicitStatus) && explicitStatus >= 400
      ? explicitStatus
      : res.statusCode >= 400
      ? res.statusCode
      : 500;

  res.status(statusCode).json({
    message: statusCode === 500 ? "Internal server error." : err.message,
  });
}

module.exports = {
  notFound,
  errorHandler,
};
