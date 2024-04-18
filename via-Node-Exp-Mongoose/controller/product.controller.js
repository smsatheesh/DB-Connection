const client = require( "../config/connection" );
const config = require( "./../config/app.config" );
const model = require( "../models/product.model" );
const print = console.log.bind( console );

let ProductController = {

    buildProducts: async( req, res, next ) => {

        try {

            if( req. body && req.body[ "length" ] > 0 ) {

                await model.bulkSave( req.body )
                    .then((response) => {
                        return res.status( 200 ).send( response );
                    })
                    .catch((err) => {
                        throw err;
                    });
            } else {
                return res.status( 200 ).send( "Input data expected" );
            }
        } catch( error ) {
            next( error );
            return res.status( 500 ).send( error.message );
        }
    },

    reviseProduct: async( req, res, next ) => {

        try {

            if( req.params[ "id" ] && req.body ) {

                await model.updateOne({ "_id": req.params.id }, req.body )
                    .then((response) => {
                        return res.status( 200 ).send( response );
                    })
                    .catch((err) => {
                        throw err;
                    })
            } else
                return res.status( 200 ).send( "Input, id value missing" );
        } catch( error ) {
            next( error );
            return res.status( 500 ).send( error.message );
        }
    },

    removeProduct: async( req, res, next ) => {

        try {

            if( req.params.id != ":id" ) {

                await model.deleteOne({ "_id": req.params.id })
                    .then(( response ) =>{
                        return res.status( 200 ).send( response );
                    })
                    .catch((err) => {
                        throw err;
                    })
            } else
                return res.status( 200 ).send( "Input, id value missing" );
        } catch( error )  {
            next( error );
            return res.status( 500 ).send( error.message );
        }
    },

    fetchSpecificProduct: async( req, res, next ) => {

        try {

            if( req.params.id != ':id' ) {

                await model.findById( req.params.id )
                .then(( data ) => {
                    return res.status( 200 ).send( data );
                })
                .catch((err) => {
                    throw err;
                })
            } else 
                return res.status( 200 ).send( "Input, id value missing" );
        } catch( error ) {
            next( error );
            return res.status( 500 ).send( error.message );
        }
    },

    fetchProducts: async ( req, res, next ) => {
    
        try {
    
            await model.find()
                .then((data) => {
                    return res.status( 200 ).send( data ); 
                })
                .catch((err) => {
                    throw err;
                });
        } catch( error ) {
    
            next( error );
            res.status( 500 ).send( error.message );
        }
    }

}

module.exports = ProductController;