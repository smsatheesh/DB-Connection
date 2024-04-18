'use strict';

process.env.QVWS_APP_CONFIG = "development";

const express = require( "express" );
const config = require( "./config/app.config" );
const bodyParser = require( "body-parser" );
const router = require( "./routes/product.router" );
const client = require( "./config/connection" );

const app = express();
const print = console.log.bind( console );

app.set( "config", config );

const PORT = parseInt( config.APP.PORT );

app.use( bodyParser.urlencoded({ extended: true }) );
app.use( bodyParser.json() );

require( "./routes/index" )( app );
app.use( express.json() );

let listener = app.listen( PORT, () => {
                    print( "Server is listening -> " + listener.address().port );
                });

client();