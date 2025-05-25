const mongoose = require("mongoose");
const config = require("./app.config");

const server = config.DB_NAME.DB_HOST;
const database = config.DB_NAME.NAME;
const print = console.log.bind(console);

const connectDB = async () => {
  try {
    const connect = await mongoose.connect(`mongodb://${server}/${database}`);

    print("Collection name -> " + connect.connection.name);
  } catch (error) {
    print(error);
  }
};
module.exports = connectDB;
