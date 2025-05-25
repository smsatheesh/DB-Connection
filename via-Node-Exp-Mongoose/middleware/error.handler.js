const errorMessage = require("../defaults/error.message");

const HttpStatus = {
  OK: 200,
  BAD_REQUEST: 400,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
};

// Convert HTML errors to JSON format
function errorHandler(err, req, res, next) {
  // Set response type to JSON
  res.setHeader("Content-Type", "application/json");

  console.error("Error:", err.message);
  console.error("Stack:", err.stack);

  // Set default status code if not set
  const statusCode = err.statusCode || HttpStatus.INTERNAL_SERVER_ERROR;

  // Handle specific error cases
  switch (statusCode) {
    case HttpStatus.NOT_FOUND:
      return res.status(statusCode).json({
        success: false,
        message: err.message || errorMessage.PRODUCT_NOT_FOUND,
        error:
          process.env.NODE_ENV === "development"
            ? errorMessage.PRODUCT_NOT_FOUND
            : undefined,
      });

    case HttpStatus.BAD_REQUEST:
      return res.status(statusCode).json({
        success: false,
        message: err.message || errorMessage.INVALID_PRODUCT_DATA,
        error:
          process.env.NODE_ENV === "development"
            ? errorMessage.INVALID_PRODUCT_DATA
            : undefined,
      });

    default:
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: errorMessage.INTERNAL_SERVER_ERROR,
        error:
          process.env.NODE_ENV === "development"
            ? errorMessage.INTERNAL_SERVER_ERROR
            : undefined,
      });
  }
}

// Handle 404 - Route not found
function notFoundHandler(req, res, next) {
  res.status(HttpStatus.NOT_FOUND).json({
    success: false,
    message: "Route not found",
    error: `Cannot ${req.method} ${req.url}`,
  });
}

// Handle uncaught errors
function uncaughtErrorHandler(err, req, res, next) {
  res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
    success: false,
    message: "Internal Server Error",
    error: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
}

module.exports = {
  errorHandler,
  notFoundHandler,
  uncaughtErrorHandler,
  HttpStatus,
};
