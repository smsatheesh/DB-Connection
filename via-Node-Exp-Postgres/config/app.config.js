const dotenv = require( 'dotenv');

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
        NAME: process.env.DB || "postgres",
        DB_SCHEMA: process.env.DB_SCHEMA || "training",
        DB_HOST: process.env.DB_HOST || "localhost",
        DB_PORT: process.env.DB_PORT || "5432",
        DB_USER_PGPLSQL: process.env.DB_USER_PGPLSQL || "postgres",
        DB_PASSWORD: process.env.DB_PASSWORD || ""
    },
    MAIL: {
        SERVICE_NAME: "gmail",
        SERVICE_HOST: "smtp.gmail.com",
        SERVICE_PORT: 587,
        SERVICE_AUTH_USER_MAIL: process.env.USER_EMAIL_ID,
        SERVICE_AUTH_USER_MAIL_PASSWORD: process.env.USER_EMAIL_PASSWORD,
        FROM_ADDRESS: process.env.USER_EMAIL_ID,
        TO_ADDRESS: process.env.USER_EMAIL_ID
    }
};