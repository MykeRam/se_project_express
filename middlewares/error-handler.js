const { isCelebrateError } = require("celebrate");

const BAD_REQUEST = 400;
const INTERNAL_SERVER_ERROR = 500;

module.exports = (err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }

  const celebrateError = isCelebrateError(err);
  const statusCode = celebrateError
    ? BAD_REQUEST
    : err.statusCode || INTERNAL_SERVER_ERROR;
  const message = celebrateError ? "Validation failed" : err.message;

  return res.status(statusCode).send({
    message:
      statusCode === INTERNAL_SERVER_ERROR
        ? "An error has occurred on the server."
        : message,
  });
};
