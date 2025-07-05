"use strict";

process.env.QVWS_APP_CONFIG = "development";

const express = require("express"),
  bodyParser = require("body-parser"),
  client = require("./config/connection"),
  config = require("./config/app.config"),
  https = require("https"),
  http = require("http"),
  debug = require("debug")("nodeformio:server"),
  logger = require("./logger/logger.handler"),
  swaggerUi = require("swagger-ui-express"),
  swaggerSpecs = require("./config/swagger"),
  models = require("./models/index"),
  {
    errorHandler,
    notFoundHandler,
    uncaughtErrorHandler,
  } = require("./middleware/error.handler");

const app = express();
app.set("config", config);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.json());

require("./routes/index")(app);

const PORT = normalisePort(config.APP.PORT);
app.set("port", PORT);

// Swagger UI setup
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

// Health Check
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Health Check Successful",
    timestamp: new Date().toISOString(),
  });
});

let server = null;
if (client.enable_https) {
  server = https.createServer(httpsOptions, app);
} else {
  server = http.createServer(app);
}

startHTTPserver();

// Handle 404 errors for undefined routes
app.use(notFoundHandler);

// Error handling middleware
app.use(errorHandler);

// Handle uncaught errors
app.use(uncaughtErrorHandler);

function startHTTPserver() {
  /*
        CREATING http server
    */
  models.sequelize
    .sync({
      force: false,
      logging: console.log,
    })
    .then(() => {
      server.listen(PORT);
      server.on("error", onError);
      server.on("listening", onListening);
    });
}

function normalisePort(portNo) {
  let portValue = parseInt(portNo, 10);

  if (isNaN(portValue)) return portNo;
  else {
    if (portValue >= 0) return portValue;
    else return false;
  }
}

function onListening() {
  const address = server.address();
  let bind =
    typeof address === "string" ? "pipe" + address : "port " + address.port;
  debug("Listening on " + bind);
  console.log("Server is listening on the port: " + address.port);
}

function onError(error) {
  if (error.syscall != "listen") throw error;

  let bind = typeof (address === "string")
    ? "pipe" + address
    : "port" + address;

  switch (error.code) {
    case "EACCESS":
      console.error(bind + " require elevated privileages");
      process.exit(1);
    case "EADDRINUSE":
      console.error(bind + " already in use");
      process.exit(1);
    default:
      throw error;
  }
}
