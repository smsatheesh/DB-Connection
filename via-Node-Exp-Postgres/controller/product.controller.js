const productService = require("../service/product.service");
const { HttpStatus } = require("../middleware/error.handler");

let ProductController = {
  /**
   * @swagger
   * components:
   *   schemas:
   *     Product:
   *       type: object
   *       required:
   *         - name
   *         - price
   *         - stocks
   *         - expiry_date
   *       properties:
   *         name:
   *           type: string
   *           description: Name of the product
   *           minLength: 1
   *           maxLength: 255
   *           example: "Product 1"
   *         description:
   *           type: string
   *           description: Product description (optional)
   *           maxLength: 1000
   *           example: "This is a description of the product"
   *         price:
   *           type: integer
   *           description: Product price in smallest currency unit (e.g., cents)
   *           minimum: 0
   *           exclusiveMinimum: true
   *           example: 10000
   *         stocks:
   *           type: integer
   *           description: Available stock quantity (must be positive)
   *           minimum: 1
   *           example: 100
   *         expiry_date:
   *           type: string
   *           format: date
   *           description: Product expiry date (must be a future date)
   *           example: "2026-01-01"
   *           pattern: "^\\d{4}-\\d{2}-\\d{2}$"
   *
   *     ProductResponse:
   *       type: object
   *       properties:
   *         dataValues:
   *           type: object
   *           properties:
   *             id:
   *               type: integer
   *               description: Auto-generated product ID
   *               example: 1
   *             product_name:
   *               type: string
   *               description: Name of the product
   *               example: "Product 1"
   *             product_description:
   *               type: string
   *               description: Product description
   *               example: "This is a description of the product"
   *             created_at:
   *               type: string
   *               format: date-time
   *               description: Timestamp when the product was created
   *               example: "2024-03-20T10:00:00.000Z"
   *             updated_at:
   *               type: string
   *               format: date-time
   *               description: Timestamp when the product was last updated
   *               example: "2024-03-20T10:00:00.000Z"
   *
   *     ProductDetailResponse:
   *       type: object
   *       properties:
   *         dataValues:
   *           type: object
   *           properties:
   *             id:
   *               type: integer
   *               description: Auto-generated product detail ID
   *               example: 1
   *             product_id:
   *               type: integer
   *               description: Reference to the product
   *               example: 1
   *             product_name:
   *               type: string
   *               description: Name of the product (for reference)
   *               example: "Product 1"
   *             price:
   *               type: integer
   *               description: Product price in smallest currency unit (e.g., cents)
   *               example: 10000
   *             stocks:
   *               type: integer
   *               description: Available stock quantity
   *               example: 100
   *             inward_date:
   *               type: string
   *               format: date
   *               description: Date when product was added
   *               example: "2024-03-20"
   *             expiry_date:
   *               type: string
   *               format: date
   *               description: Product expiry date
   *               example: "2025-01-01"
   *             created_at:
   *               type: string
   *               format: date-time
   *               description: Timestamp when the product detail was created
   *               example: "2024-03-20T10:00:00.000Z"
   *             updated_at:
   *               type: string
   *               format: date-time
   *               description: Timestamp when the product detail was last updated
   *               example: "2024-03-20T10:00:00.000Z"
   */

  /**
   * @swagger
   * /api/build/products:
   *   post:
   *     summary: Create new products in bulk
   *     tags: [Products]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: array
   *             items:
   *               $ref: '#/components/schemas/Product'
   *     responses:
   *       201:
   *         description: Products created successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: true
   *                   description: Indicates if the operation was successful
   *                 message:
   *                   type: string
   *                   description: Success message
   *                   example: "Products created successfully"
   *                 data:
   *                   type: object
   *                   properties:
   *                     product:
   *                       type: array
   *                       description: Array of created products
   *                       items:
   *                         $ref: '#/components/schemas/ProductResponse'
   *                     product_detail:
   *                       type: array
   *                       description: Array of created product details
   *                       items:
   *                         $ref: '#/components/schemas/ProductDetailResponse'
   *       400:
   *         description: Bad request - No products provided or validation error
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: false
   *                 error:
   *                   type: string
   *                   example: "No products provided"
   *                 statusCode:
   *                   type: integer
   *                   example: 400
   *       422:
   *         description: Unprocessable entity - Expiry date is invalid
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: false
   *                 error:
   *                   type: string
   *                   example: "Expiry date is invalid, it should be greater than today's date"
   *                 statusCode:
   *                   type: integer
   *                   example: 422
   *       500:
   *         description: Server error
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: false
   *                 error:
   *                   type: string
   *                   example: "Internal server error"
   *                 statusCode:
   *                   type: integer
   *                   example: 500
   */
  buildProducts: async (req, res, next) => {
    return await productService.buildProducts(req, res, next);
  },

  /**
   * @swagger
   * /api/revise/product/{id}:
   *   put:
   *     summary: Update a product
   *     tags: [Products]
   *     parameters:
   *       - in: path
   *         name: id
   *         schema:
   *           type: integer
   *         required: true
   *         description: Product ID
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/Product'
   *     responses:
   *       200:
   *         description: Product updated successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: true
   *                 message:
   *                   type: string
   *                   example: "Product updated successfully"
   *                 data:
   *                   type: object
   *                   properties:
   *                     product_id:
   *                       type: integer
   *                       example: 1
   *                     product_name:
   *                       type: string
   *                       example: "Updated Product"
   *                     product_description:
   *                       type: string
   *                       example: "Updated description"
   *                     price:
   *                       type: integer
   *                       example: 15000
   *                     stocks:
   *                       type: integer
   *                       example: 150
   *                     inward_date:
   *                       type: string
   *                       format: date
   *                       example: "2024-03-20"
   *                     expiry_date:
   *                       type: string
   *                       format: date
   *                       example: "2025-01-01"
   *                     created_at:
   *                       type: string
   *                       format: date-time
   *                       example: "2024-03-20T10:00:00.000Z"
   *                     updated_at:
   *                       type: string
   *                       format: date-time
   *                       example: "2024-03-20T11:00:00.000Z"
   *       400:
   *         description: Bad request - Invalid input or validation error
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: false
   *                 error:
   *                   type: string
   *                   example: "Invalid input data"
   *                 statusCode:
   *                   type: integer
   *                   example: 400
   *       404:
   *         description: Product not found
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: false
   *                 error:
   *                   type: string
   *                   example: "Product not found"
   *                 statusCode:
   *                   type: integer
   *                   example: 404
   *       422:
   *         description: Unprocessable entity - Expiry date is invalid
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: false
   *                 error:
   *                   type: string
   *                   example: "Expiry date is invalid"
   *                 statusCode:
   *                   type: integer
   *                   example: 422
   *       500:
   *         description: Server error
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: false
   *                 error:
   *                   type: string
   *                   example: "Internal server error"
   *                 statusCode:
   *                   type: integer
   *                   example: 500
   */
  reviseProduct: async (req, res, next) => {
    return await productService.reviseProduct(req, res, next);
  },

  /**
   * @swagger
   * /api/remove/product/{id}:
   *   delete:
   *     summary: Delete a product
   *     tags: [Products]
   *     parameters:
   *       - in: path
   *         name: id
   *         schema:
   *           type: integer
   *         required: true
   *         description: Product ID
   *     responses:
   *       204:
   *       404:
   *         description: Product not found
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: false
   *                 error:
   *                   type: string
   *                   example: "Product not found"
   *                 statusCode:
   *                   type: integer
   *                   example: 404
   *       500:
   *         description: Server error
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: false
   *                 error:
   *                   type: string
   *                   example: "Internal server error"
   *                 statusCode:
   *                   type: integer
   *                   example: 500
   */
  removeProduct: async (req, res, next) => {
    return await productService.removeProduct(req, res, next);
  },

  /**
   * @swagger
   * /api/product/{id}:
   *   get:
   *     summary: Get a specific product by ID
   *     tags: [Products]
   *     parameters:
   *       - in: path
   *         name: id
   *         schema:
   *           type: integer
   *         required: true
   *         description: Product ID
   *     responses:
   *       200:
   *         description: Product details retrieved successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: true
   *                 message:
   *                   type: string
   *                   example: "Product found successfully"
   *                 data:
   *                   type: object
   *                   properties:
   *                     product_id:
   *                       type: integer
   *                       example: 1
   *                     product_name:
   *                       type: string
   *                       example: "Product 1"
   *                     product_description:
   *                       type: string
   *                       example: "Product description"
   *                     price:
   *                       type: integer
   *                       example: 10000
   *                     stocks:
   *                       type: integer
   *                       example: 100
   *                     inward_date:
   *                       type: string
   *                       format: date
   *                       example: "2024-03-20"
   *                     expiry_date:
   *                       type: string
   *                       format: date
   *                       example: "2025-01-01"
   *                     created_at:
   *                       type: string
   *                       format: date-time
   *                       example: "2024-03-20T10:00:00.000Z"
   *                     updated_at:
   *                       type: string
   *                       format: date-time
   *                       example: "2024-03-20T10:00:00.000Z"
   *       404:
   *         description: Product not found
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: false
   *                 error:
   *                   type: string
   *                   example: "Product not found"
   *                 statusCode:
   *                   type: integer
   *                   example: 404
   *       500:
   *         description: Server error
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: false
   *                 error:
   *                   type: string
   *                   example: "Internal server error"
   *                 statusCode:
   *                   type: integer
   *                   example: 500
   */
  fetchSpecificProduct: async (req, res, next) => {
    return await productService.fetchSpecificProduct(req, res, next);
  },

  /**
   * @swagger
   * /api/products:
   *   get:
   *     summary: Get all products
   *     tags: [Products]
   *     responses:
   *       200:
   *         description: Products retrieved successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: true
   *                 message:
   *                   type: string
   *                   example: "All products and its details fetched successfully"
   *                 data:
   *                   type: array
   *                   items:
   *                     type: object
   *                     properties:
   *                       product_id:
   *                         type: integer
   *                         example: 1
   *                       product_name:
   *                         type: string
   *                         example: "Product 1"
   *                       product_description:
   *                         type: string
   *                         example: "Product description"
   *                       price:
   *                         type: integer
   *                         example: 10000
   *                       stocks:
   *                         type: integer
   *                         example: 100
   *                       inward_date:
   *                         type: string
   *                         format: date
   *                         example: "2024-03-20"
   *                       expiry_date:
   *                         type: string
   *                         format: date
   *                         example: "2025-01-01"
   *                       created_at:
   *                         type: string
   *                         format: date-time
   *                         example: "2024-03-20T10:00:00.000Z"
   *                       updated_at:
   *                         type: string
   *                         format: date-time
   *                         example: "2024-03-20T10:00:00.000Z"
   *       500:
   *         description: Server error
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: false
   *                 error:
   *                   type: string
   *                   example: "Internal server error"
   *                 statusCode:
   *                   type: integer
   *                   example: 500
   */
  fetchProducts: async (req, res, next) => {
    return await productService.fetchProducts(req, res, next);
  },
};

module.exports = ProductController;
