const config = require( "./app.config" );

{
    development = {
        host: config.DB.DB_HOST,
        port: config.DB.DB_PORT,
        user: config.DB.DB_USER_PGPLSQL,
        password: config.DB.DB_PASSWORD,
        database: config.DB.NAME,
        schema_name: config.DB.DB_SCHEMA,
        dialect: config.DB.NAME,
        drop_tables: false,
        enable_https: false
    }
}

module.exports = development;