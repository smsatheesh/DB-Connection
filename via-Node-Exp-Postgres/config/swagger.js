const swaggerJsdoc = require("swagger-jsdoc");
const config = require("./app.config");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Postgres API",
      version: "1.0.0",
      description: "A simple Express Postgres API",
    },
    servers: [
      {
        url: `http://${config.APP.ENV}:${config.APP.PORT}`,
        description: "Local server",
      },
    ],
  },
  apis: ["./controller/*.js"], // Path to the API docs
};

const specs = swaggerJsdoc(options);
module.exports = specs;
