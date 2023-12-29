const express = require( "express" );
const router = express.Router();
const productController = require( "../controller/product.controller" );

// Adding routes

router.get( '/', (req, res) => {
    productController.fetchProducts(req, res);
});

router.get( '/product/:id', (req, res) => {
    productController.fetchProduct(req, res);
});

router.post( '/product/insert', (req, res) => {
    productController.insertProduct(req, res);
});

router.put( '/product/update/:id', (req, res) => {
    productController.updateProduct(req, res);
});

router.delete( '/product/delete/:id', (req, res) => {
    productController.deleteProduct(req, res);
});

module.exports = router;
