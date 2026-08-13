const INTERNAL_SERVER_ERROR = 500;

module.exports = (err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }

  const { statusCode = INTERNAL_SERVER_ERROR, message } = err;

  return res.status(statusCode).send({
    message:
      statusCode === INTERNAL_SERVER_ERROR
        ? "An error has occurred on the server."
        : message,
  });
};
