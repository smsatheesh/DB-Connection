const express = require( "express" );
const router = express.Router();
const productController = require( "../controller/product.controller" );

// Adding routes

router.get( '/get', (req, res) => {
    productController.fetchProducts(req, res);
});

module.exports = router;
