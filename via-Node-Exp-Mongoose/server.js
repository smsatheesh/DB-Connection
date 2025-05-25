"use strict";

const express = require("express");
const config = require("./config/app.config");
const bodyParser = require("body-parser");
const router = require("./routes/product.router");
const client = require("./config/connection");
const swaggerUi = require("swagger-ui-express");
const swaggerSpecs = require("./config/swagger");
const logger = require("./logger/logger.handler");
const morgan = require("morgan");
const fs = require("fs");
const path = require("path");
const {
  errorHandler,
  notFoundHandler,
  uncaughtErrorHandler,
} = require("./middleware/error.handler");

const app = express();
let server; // Store server instance for graceful shutdown

// Ensure logs directory exists
const logsDir = path.join(__dirname, "logs");
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir);
}

// Create a write stream for Morgan access logs
const accessLogStream = fs.createWriteStream(path.join(logsDir, "access.log"), {
  flags: "a",
});

// Configure Morgan middleware
app.use(morgan("combined", { stream: accessLogStream }));

// Set default content type to JSON
app.use((req, res, next) => {
  res.setHeader("Content-Type", "application/json");
  next();
});

// Log all requests
app.use((req, res, next) => {
  logger.info("Incoming request", {
    method: req.method,
    path: req.path,
    query: req.query,
    ip: req.ip,
  });
  next();
});

app.set("config", config);

const PORT = parseInt(config.APP.PORT);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.json());

// Handle JSON parsing errors
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    return res.status(400).json({
      success: false,
      message: "Invalid JSON payload",
      error: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }
  next(err);
});

// Swagger UI setup
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

require("./routes/index")(app);

// Health Check
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Health Check Successful",
    timestamp: new Date().toISOString(),
  });
});

// Handle 404 errors for undefined routes
app.use(notFoundHandler);

// Error handling middleware
app.use(errorHandler);

// Handle uncaught errors
app.use(uncaughtErrorHandler);

/**
 * Graceful shutdown handler
 * @param {string} signal - The signal received
 */
async function gracefulShutdown(signal) {
  logger.info(`${signal} signal received: starting graceful shutdown`);

  // Close HTTP server (stop accepting new connections)
  if (server) {
    logger.info("Closing HTTP server");
    await new Promise((resolve) => {
      server.close((err) => {
        if (err) {
          logger.error("Error closing HTTP server", { error: err.message });
          return resolve();
        }
        logger.info("HTTP server closed successfully");
        resolve();
      });
    });
  }

  // Close database connection
  try {
    logger.info("Closing database connection");
    // Assuming mongoose is used in the client connection
    const mongoose = require("mongoose");
    await mongoose.connection.close();
    logger.info("Database connection closed successfully");
  } catch (err) {
    logger.error("Error closing database connection", { error: err.message });
  }

  // Close file streams
  try {
    logger.info("Closing file streams");
    await new Promise((resolve) => {
      accessLogStream.end(() => {
        logger.info("File streams closed successfully");
        resolve();
      });
    });
  } catch (err) {
    logger.error("Error closing file streams", { error: err.message });
  }

  // Exit process
  logger.info("Graceful shutdown completed");
  process.exit(0);
}

// Start the server
server = app.listen(PORT, () => {
  logger.info(`Server started`, {
    port: server.address().port,
    environment: config.APP.ENV || "development",
    nodeVersion: process.version,
    platform: process.platform,
  });
  logger.info(
    `API Documentation available at -> http://${config.APP.ENV}:${PORT}/api-docs`
  );
});

// Initialize database connection
client().catch((err) => {
  logger.error("Failed to connect to database", {
    error: err.message,
    stack: err.stack,
  });
  process.exit(1);
});

// Handle process events
process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));

// Handle uncaught exceptions
process.on("uncaughtException", (error) => {
  logger.error("Uncaught Exception", {
    error: error.message,
    stack: error.stack,
    type: error.name,
    timestamp: new Date().toISOString(),
  });
  // Attempt graceful shutdown
  gracefulShutdown("uncaughtException");
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (reason, promise) => {
  logger.error("Unhandled Promise Rejection", {
    reason: reason instanceof Error ? reason.message : reason,
    stack: reason instanceof Error ? reason.stack : undefined,
    timestamp: new Date().toISOString(),
  });
  // Log the promise details if possible
  promise.catch((err) => {
    logger.error("Promise details", {
      error: err.message,
      stack: err.stack,
    });
  });
});
