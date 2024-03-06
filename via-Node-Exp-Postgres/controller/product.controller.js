const print = console.log.bind( console );

// Adding controller methods
module.exports.fetchProducts = async ( req, res ) => {
    print( "test" );
    res.status( 200 ).send( "good" );
}