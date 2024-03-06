const fs = require( "fs" );

module.exports = ( app ) => {
    fs.readdirSync( __dirname )
        .forEach((file) => {
            if( file == "index.js" || file.substr( file.lastIndexOf( "." ) + 1 ) !== 'js' )
                return;
            let name = file.substr( 0, file.lastIndexOf( "." ));
            let routes = require( "./" + name );
            app.use( "/api", routes );
        });
}