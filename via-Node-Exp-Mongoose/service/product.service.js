const Product = require("../models/product.model");
const { errorMessage } = require("../defaults/error.message");
const { HttpStatus } = require("../middleware/error.handler");
const logger = require("../logger/logger.handler");
const { v4: uuid_v4 } = require("uuid");
const moment = require("moment");

class ProductService {
  async buildProducts(products) {
    if (!products || products.length === 0) {
      const error = new Error(errorMessage.INPUT_DATA_EXPECTED);
      error.statusCode = HttpStatus.BAD_REQUEST;
      logger.error("Product creation failed: No input data", {
        error: error.message,
        statusCode: error.statusCode,
      });
      throw error;
    }
    try {
      products.forEach((product) => {
        const docId = uuid_v4();
        product.id = docId;
        product["_id"] = docId;
        product.createdAt = moment().format("YYYY-MM-DD HH:mm:ss");
        product.updatedAt = moment().format("YYYY-MM-DD HH:mm:ss");
      });
      const createdProducts = await Product.create(products);
      logger.info("Products created successfully", {
        count: products.length,
        productIds: createdProducts.map((p) => p._id),
      });
      return createdProducts;
    } catch (error) {
      logger.error("Product creation failed", {
        error: error.message,
        stack: error.stack,
      });
      error.statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
      throw error;
    }
  }

  async reviseProduct(id, productData) {
    if (!id || !productData) {
      const error = new Error(errorMessage.ID_VALUE_MISSING);
      error.statusCode = HttpStatus.BAD_REQUEST;
      logger.error("Product update failed: Missing data", {
        error: error.message,
        statusCode: error.statusCode,
        productId: id,
      });
      throw error;
    }
    try {
      productData["updatedAt"] = moment().format("YYYY-MM-DD HH:mm:ss");
      const updatedProduct = await Product.findByIdAndUpdate(
        id,
        { $set: productData },
        { new: true, runValidators: true }
      );
      if (!updatedProduct) {
        const error = new Error(errorMessage.PRODUCT_NOT_FOUND);
        error.statusCode = HttpStatus.NOT_FOUND;
        logger.warn("Product not found for update", { productId: id });
        throw error;
      }
      logger.info("Product updated successfully", {
        productId: id,
        updates: Object.keys(productData),
      });
      return updatedProduct;
    } catch (error) {
      logger.error("Product update failed", {
        error: error.message,
        stack: error.stack,
        productId: id,
      });
      if (!error.statusCode) {
        error.statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
      }
      throw error;
    }
  }

  async removeProduct(id) {
    if (!id || id === ":id") {
      const error = new Error(errorMessage.ID_VALUE_MISSING);
      error.statusCode = HttpStatus.BAD_REQUEST;
      logger.error("Product deletion failed: Invalid ID", {
        error: error.message,
        statusCode: error.statusCode,
        productId: id,
      });
      throw error;
    }
    try {
      const deletedProduct = await Product.findByIdAndDelete(id);
      if (!deletedProduct) {
        const error = new Error(errorMessage.PRODUCT_NOT_FOUND);
        error.statusCode = HttpStatus.NOT_FOUND;
        logger.warn("Product not found for deletion", { productId: id });
        throw error;
      }
      logger.info("Product deleted successfully", { productId: id });
      return deletedProduct;
    } catch (error) {
      logger.error("Product deletion failed", {
        error: error.message,
        stack: error.stack,
        productId: id,
      });
      if (!error.statusCode) {
        error.statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
      }
      throw error;
    }
  }

  async fetchSpecificProduct(id) {
    if (!id || id === ":id") {
      const error = new Error(errorMessage.ID_VALUE_MISSING);
      error.statusCode = HttpStatus.BAD_REQUEST;
      logger.error("Product fetch failed: Invalid ID", {
        error: error.message,
        statusCode: error.statusCode,
        productId: id,
      });
      throw error;
    }
    try {
      const product = await Product.findById(id).exec();
      if (!product) {
        const error = new Error(errorMessage.PRODUCT_NOT_FOUND);
        error.statusCode = HttpStatus.NOT_FOUND;
        logger.warn("Product not found", { productId: id });
        throw error;
      }
      logger.info("Product fetched successfully", { productId: id });
      return product;
    } catch (error) {
      logger.error("Product fetch failed", {
        error: error.message,
        stack: error.stack,
        productId: id,
      });
      if (!error.statusCode) {
        error.statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
      }
      throw error;
    }
  }

  async fetchProducts() {
    try {
      const products = await Product.find().lean().exec();
      logger.info("All products fetched successfully", {
        count: products.length,
      });
      return products;
    } catch (error) {
      logger.error("Failed to fetch all products", {
        error: error.message,
        stack: error.stack,
      });
      error.statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
      throw error;
    }
  }
}

module.exports = new ProductService();
