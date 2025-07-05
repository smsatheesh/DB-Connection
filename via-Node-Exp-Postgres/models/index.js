"use strict";

const fs = require("fs"),
  path = require("path"),
  Sequelize = require("sequelize"),
  logger = require("../logger/logger.handler"),
  baseName = path.basename(__filename),
  appConfig = require("../config/app.config.js"),
  sequelize = require("../config/connection.js"),
  db = {};

logger.info("Initializing models...");

fs.readdirSync(__dirname)
  .filter((file) => {
    return (
      file.indexOf(".") !== 0 && file !== baseName && file.slice(-3) === ".js"
    );
  })
  .forEach((file) => {
    const model = require(path.join(__dirname, file))(
      sequelize,
      Sequelize.DataTypes
    );
    db[model.name] = model;
    logger.info(`Model loaded: ${model.name}`);
  });

logger.info("Setting up model associations...");
Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;
db.config = appConfig;

logger.info("Models initialization completed.");

module.exports = db;
