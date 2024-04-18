const mongoose = require( "mongoose" );
const config = require( "./app.config" );

const server = config.DB.DB_HOST;
const database = config.DB.NAME;
const print = console.log.bind( console );

const connectDB = async() => {

    try {

        const connect 
                = await mongoose
                    .connect(
                        `mongodb://${server}/${database}`,
                    );
        
        print( "Collection name -> " + connect.connection.name );
    } catch( error ) {
        print( error );
    }
}
module.exports = connectDB;