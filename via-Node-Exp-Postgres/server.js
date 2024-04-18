'use strict';

process.env.QVWS_APP_CONFIG = "development";

const express = require( "express" ),
   bodyParser = require( "body-parser" ),
        client = require( "./config/connection" ),
        config = require( "./config/app.config" ),
        models = require( "./models/index" ),
        https = require( "https" ),
        http = require( "http" ), 
        debug = require( "debug" )( "nodeformio:server" ),
        print = console.log.bind( console );

const app = express();
app.set('config', config);

app.use( bodyParser.urlencoded({ extended: true }) );
app.use( bodyParser.json() );

require( "./routes/index" )( app );

const PORT = normalisePort( config.APP.PORT || models.config.APP.PORT );
app.set( "port", PORT );


let server = null;
if( client.enable_https && process.env.QVWS_APP_CONFIG !== "development" )
    server = https.createServer( httpsOptions, app );
else
    server = http.createServer( app );

startHTTPserver();

function startHTTPserver() {
    /*
        CREATING http server
    */
    models.sequelize.sync({
        force: false,
        logging: console.log
    }).then(() => {
        server.listen( PORT );
        server.on( "error", onError );
        server.on( "listening", onListening );
    });
}

function normalisePort( portNo ) {

    let portValue = parseInt( portNo, 10 );

    if( isNaN( portValue ))
        return portNo;
    else {
        if( portValue >= 0 )
            return portValue;
        else
            return false;
    }
}

function onListening() {
    const address = server.address();
    let bind = ( typeof address === "string")? 'pipe' + address: 'port ' + address.port;
    debug( "Listening on " + bind );
    console.log( "Server is listening on the port: " + address.port );
}

function onError( error ) {
    if( error.syscall != "listen" ) 
        throw error;

    let bind = typeof ( address === "string")? 'pipe' + address: 'port' + address;

    switch( error.code ) {
        case "EACCESS":
            console.error( bind + " require elevated privileages" );
            process.exit( 1 );
        case "EADDRINUSE":
            console.error( bind + " already in use" );
            process.exit( 1 );
        default:
            throw error; 
    }
}
