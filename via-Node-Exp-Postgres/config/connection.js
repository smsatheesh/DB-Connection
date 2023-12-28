const { Client } = require( "pg" );
const config = require( "./app.config" );

const client = new Client({
    host: config.DB.DB_HOST,
    port: config.DB.DB_PORT,
    user: config.DB.DB_USER_PGPLSQL,
    password: config.DB.DB_PASSWORD,
    database: config.DB.NAME,
    drop_tables: false
    // currentSchema: process.env.DB_SCHEMA
});

module.exports = client;