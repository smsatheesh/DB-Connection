const express = require("express");
const router = express.Router();
const productController = require("../controller/product.controller");

router.post("/products", (req, res, next) => {
  productController.buildProducts(req, res, next);
});

router.put("/product/:id", (req, res, next) => {
  productController.reviseProduct(req, res, next);
});

router.delete("/product/:id", (req, res, next) => {
  productController.removeProduct(req, res, next);
});

router.get("/products/all", (req, res, next) => {
  productController.fetchProducts(req, res, next);
});

router.get("/product/:id", (req, res, next) => {
  productController.fetchSpecificProduct(req, res, next);
});

module.exports = router;
