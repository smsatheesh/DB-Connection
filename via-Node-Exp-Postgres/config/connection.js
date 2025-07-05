const logger = require("../logger/logger.handler"),
  config = require("./app.config"),
  Sequelize = require("sequelize");

const connectionConfig = {
  host: config.DB.DB_HOST,
  port: config.DB.DB_PORT,
  dialect: "postgres",
  timezone: "+05:30",
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
  dialectOptions: {
    useUTC: false,
  },
  enable_https: true,
};

const sequelize = new Sequelize(
  config.DB.NAME,
  config.DB.DB_USER_PGPLSQL,
  config.DB.DB_PASSWORD,
  {
    ...connectionConfig,
    logging: (msg) => logger.info(msg),
  }
);

// Test the connection
sequelize
  .authenticate()
  .then(() => {
    logger.info("Database connection has been established successfully.");
  })
  .catch((err) => {
    logger.error("Unable to connect to the database:", err);
  });

module.exports = sequelize;
