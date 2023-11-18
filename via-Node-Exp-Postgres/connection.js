const { Client } = require( "pg" );

const client = new Client({
    host: process.env.dbHost,
    port: process.env.dbPort,
    user: process.env.dbUser,
    password: process.env.DB_password,
    database: process.env.dataBase
});

module.exports = client;