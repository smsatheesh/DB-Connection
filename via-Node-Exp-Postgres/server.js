const express = require( "express" );
const bodyParser = require( "body-parser" );
const router = require( "./routes/userRouter" );
const client = require( "./connection" );
const dotenv = require('dotenv');

const path = `${__dirname}/.env`;
dotenv.configDotenv({
    path: path
});

const app = express();
const PORT = parseInt(process.env.PORT);

app.use( bodyParser.json() );
app.use( bodyParser.urlencoded({ extended: true }) );

app.use( '/', router );
let listener = app.listen( PORT, () => {
                    console.log( "Server is listening -> " + listener.address().port );
                });

client.connect();
client.on( "connect", () => {
    client.query( `SET schema '${process.env.DB_SCHEMA}' ` );
    console.log( "Database connected" );
});
