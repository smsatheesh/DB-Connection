
'use strict';

let fs = require( "fs" ),
    path = require( "path" ),
    Sequelize = require( "sequelize" ),
    baseName = path.basename( __filename ),
    appConfig = require( __dirname + "/../config/app.config.js" ),
    connectionConfig = require( __dirname + "/../config/connection.js" ),
    db = {},
    sequelize = null;

sequelize = new Sequelize( appConfig.DB.NAME, appConfig.DB.DB_USER_PGPLSQL, appConfig.DB.DB_PASSWORD, connectionConfig );

fs
    .readdirSync( __dirname )
    .filter((file) => {
        return (( file.indexOf( '.' ) !== 0 ) && ( file !== baseName ) && ( file.slice( -3 ) === '.js' ))
    })
    .forEach((file) => {
        const model = require( path.join( __dirname, file ))( sequelize, Sequelize.DataTypes );
        db[model.name] = model;
    });

Object.keys( db ).forEach((modelName) => {
    if( db[modelName].associate ) {
        db[modelName].associate( db );
    }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;
db.config = appConfig;

module.exports = db;

