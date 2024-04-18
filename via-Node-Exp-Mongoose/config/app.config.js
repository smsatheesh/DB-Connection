const dotenv = require( "dotenv" );

const path = `${__dirname}./../.env`;

dotenv.configDotenv({
    path: path
});

module.exports = {
    APP: {
        PORT: process.env.PORT || 3000,
        ENV: process.env.NODE_ENV || "development",
    },
    DB: {
        NAME: process.env.DB,
        DB_HOST: process.env.HOST || "localhost" + ":27017",
        DB_SCHEMA: process.env.SCHEMA
    }
}