const express = require( "express" );
const router = express.Router();
const productController = require( "../controller/product.controller" );

router.get( "/fetch/products/all", ( req, res, next ) => {
    productController.fetchProducts( req, res, next );
});

router.get( "/fetch/product/:id", ( req, res, next ) => {
    productController.fetchSpecificProduct( req, res, next );
});

router.post( "/build/products", ( req, res, next ) => {
    productController.buildProducts( req, res, next );
});

router.put( "/revise/product/details/:id",  ( req, res, next ) => {
    productController.reviseProduct( req, res, next );
});

router.delete( "/remove/product/:id", ( req, res, next ) => {
    productController.removeProduct( req, res, next );
});

module.exports = router;