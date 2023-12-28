const express = require( "express" );
const bodyParser = require( "body-parser" );
const router = require( "./routes/product.router" );
const client = require( "./config/connection" );
const config = require('./config/app.config');
const app = express();

const print = console.log.bind( console );
app.set('config', config);

const PORT = parseInt( config.APP.PORT );

app.use( bodyParser.json() );
app.use( bodyParser.urlencoded({ extended: true }) );

app.use( '/', router );
let listener = app.listen( PORT, () => {
                    print( "Server is listening -> " + listener.address().port );
                });

client.connect();
client.on( "connect", () => {
    client.query( `SET schema '${ config.APP.DB_SCHEMA }' ` );
    print( "Database connected" );
});
