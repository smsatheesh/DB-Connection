const express = require( "express" );
const router = express.Router();
const productController = require( "../controller/product.controller" );

// Adding routes

router.get( "/fetch/products/all", ( req, res, next ) => {
    productController.fetchProducts( req, res, next );
});

router.get( "/fetch/product/:id", ( req, res, next ) => {
    productController.fetchSpecificProduct( req, res, next );
});

router.post( "/build/products", ( req, res, next ) => {
    productController.buildProducts( req, res, next );
});

module.exports = router;
