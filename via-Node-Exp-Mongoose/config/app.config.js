const dotenv = require("dotenv");

const path = `${__dirname}./../.env`;

dotenv.configDotenv({
  path: path,
});

module.exports = {
  APP: {
    PORT: process.env.PORT || 3000,
    ENV: process.env.NODE_ENV || "development",
  },
  DB_NAME: {
    NAME: process.env.DB_NAME,
    DB_HOST: process.env.HOST || "localhost" + ":27017",
    COLLECTION_NAME: process.env.COLLECTION_NAME,
  },
};
