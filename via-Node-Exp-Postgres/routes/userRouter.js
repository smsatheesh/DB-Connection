const express = require( "express" );
const router = express.Router();
const userController = require( "../controller/userController" );

// Adding routes

router.get( '/', (req, res) => {
    userController.fetchProducts(req, res);
});

router.get( '/product/:id', (req, res) => {
    userController.fetchProduct(req, res);
});

router.post( '/product/insert', (req, res) => {
    userController.insertProduct(req, res);
});

router.put( '/product/update/:id', (req, res) => {
    userController.updateProduct(req, res);
});

router.delete( '/product/delete/:id', (req, res) => {
    userController.deleteProduct(req, res);
});

module.exports = router;