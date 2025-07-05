const { HttpStatus } = require("../middleware/error.handler");
const logger = require("../logger/logger.handler");
const errorMessage = require("../defaults/error.message");
const models = require("../models/index");
const sequelize = require("sequelize");
const op = sequelize.Op;
const moment = require("moment");
const mailer = require("../controller/mail.controller");
const HTML_TEMPLATE = require("./../middleware/mail-template");

//* Mailer Config
// let mailOptions = {
//     from: config.MAIL.FROM_ADDRESS,
//     to: config.MAIL.TO_ADDRESS,
//     subject: "",
//     text: "",
//     html: "",
// };

class ProductService {
  /**
   * Creates multiple products with their details in a single transaction
   * @param {Object} req - Express request object containing products array in body
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   * @returns {Promise<Object>} Object containing:
   *   - success: {boolean} - true if operation was successful
   *   - message: {string} - "Products created successfully"
   *   - data: {Object} containing:
   *     - product: {Array<Object>} Array of created product objects
   *     - product_detail: {Array<Object>} Array of created product detail objects
   * @throws {Error} BAD_REQUEST (400) - If no products provided
   * @throws {Error} UNPROCESSABLE_ENTITY (422) - If expiry date is invalid
   * @throws {Error} INTERNAL_SERVER_ERROR (500) - If database operation fails
   * @transaction Uses transaction to ensure data consistency across both tables
   */
  async buildProducts(req, res, next) {
    const products = req.body;
    const transaction = await models.sequelize.transaction();

    try {
      if (!products || products.length === 0) {
        const error = new Error(errorMessage.NO_PRODUCTS_PROVIDED);
        error.statusCode = HttpStatus.BAD_REQUEST;

        logger.error("Product creation failed: ", {
          error: error.message,
          statusCode: error.statusCode,
        });
        throw error;
      }

      const today = moment().format("YYYY-MM-DD");

      let payLoadForProuct = [],
        payLoadForProductDetails = [];
      let product_creation_response;

      products.map((element) => {
        if (today > element["expiry_date"]) {
          const error = new Error(errorMessage.EXPIRY_DATE_INVALID);
          error.statusCode = HttpStatus.UNPROCESSABLE_ENTITY;
          throw error;
        }

        payLoadForProuct.push({
          product_name: element["name"],
          product_description: element["description"],
        });

        payLoadForProductDetails.push({
          product_name: element["name"],
          price: element["price"],
          stocks: element["stocks"],
          inward_date: today,
          expiry_date: element["expiry_date"],
        });
      });

      product_creation_response = await models.product
        .bulkCreate(payLoadForProuct, { raw: true }, { transaction })
        .then((response) => {
          // if (response && response["length"] > 0) {
          //   textHeaderData = "Inserted Products ";
          //   textBodyData = "Products have been inserted into retail database";
          //   mailOptions.subject = textHeaderData;
          //   mailOptions.body = textBodyData;
          //   mailOptions.html = HTML_TEMPLATE(textHeaderData, textBodyData);
          //   mailer(mailOptions, (info) => {
          //     logger.info("Email sent successfully");
          //     logger.info("MESSAGE ID: ", info.messageId);
          //   });
          // }
          return response;
        })
        .catch(async (error) => {
          throw error;
        });

      for (let unq_values of product_creation_response) {
        for (
          let innr_loop = 0;
          innr_loop < payLoadForProductDetails["length"];
          innr_loop++
        ) {
          if (
            payLoadForProductDetails[innr_loop]["product_name"] ==
            unq_values["dataValues"]["product_name"]
          )
            payLoadForProductDetails[innr_loop]["product_id"] =
              unq_values["dataValues"]["id"];
        }
      }

      const product_detail_creation_response =
        await models.product_detail.bulkCreate(
          payLoadForProductDetails,
          { raw: true },
          { transaction }
        );

      // Commit the transaction
      await transaction.commit();

      return res.status(HttpStatus.CREATED).json({
        success: true,
        message: "Products created successfully",
        data: {
          product: product_creation_response,
          product_detail: product_detail_creation_response,
        },
      });
    } catch (error) {
      logger.debug(error);
      await transaction.rollback();
      next(error);
    }
  }

  /**
   * Updates an existing product and its details in a single transaction
   * @param {Object} req - Express request object
   * @param {string} req.params.id - Product ID to update
   * @param {Object} req.body - Update data containing name, description, price, stocks, expiry_date
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   * @returns {Promise<Object>} Updated product object with all details
   * @throws {Error} BAD_REQUEST (400) - If product ID or update data is missing
   * @throws {Error} NOT_FOUND (404) - If product doesn't exist
   * @throws {Error} INTERNAL_SERVER_ERROR (500) - If update operation fails
   * @transaction Uses transaction to ensure data consistency across both tables
   */
  async reviseProduct(req, res, next) {
    const id = req.params?.id;
    const productData = req.body;

    const transaction = await models.sequelize.transaction();

    try {
      if (!id) {
        const error = new Error(errorMessage.ID_VALUE_MISSING);
        error.statusCode = HttpStatus.BAD_REQUEST;

        logger.error("Product update failed: ", {
          error: error.message,
          statusCode: error.statusCode,
        });
        throw error;
      }

      if (!productData) {
        const error = new Error(errorMessage.PRODUCT_DATA_MISSING);
        error.statusCode = HttpStatus.BAD_REQUEST;

        logger.error("Product update failed: ", {
          error: error.message,
          statusCode: error.statusCode,
        });
        throw error;
      }

      // Check if product exists
      const detailsOfProduct = await this.completeProductDetails(id);
      if (!detailsOfProduct) {
        const error = new Error(errorMessage.PRODUCT_NOT_FOUND);
        error.statusCode = HttpStatus.NOT_FOUND;
        throw error;
      }

      let updateObject = {
        product_name: productData?.name,
        product_description: productData?.description,
        price: productData?.price,
        stocks: productData?.stocks,
        expiry_date: productData?.expiry_date,
      };

      console.log(detailsOfProduct, updateObject);
      Object.assign(detailsOfProduct, { ...updateObject });

      const response = await models.product_detail
        .update(
          updateObject,
          {
            where: {
              product_id: {
                [op.eq]: id,
              },
            },
          },
          { transaction }
        )
        .then(async (response) => {
          await models.product.update(updateObject, {
            where: {
              id: {
                [op.eq]: id,
              },
            },
          });

          //   if (response && response["length"] > 0) {
          //     textHeaderData = "Updated Product";
          //     textBodyData =
          //       "Product id :  " +
          //       updateObject["id"] +
          //       " have been updated in retail database";

          //     mailOptions.subject = textHeaderData;
          //     mailOptions.body = textBodyData;
          //     mailOptions.html = HTML_TEMPLATE(textHeaderData, textBodyData);

          //     mailer(mailOptions, (info) => {
          //       logger.info("Email sent successfully");
          //       logger.info("MESSAGE ID: ", info.messageId);
          //     });
          //   }

          // Commit the transaction
          await transaction.commit();

          return response;
        })
        .catch(async (error) => {
          throw error;
        });

      return res.status(HttpStatus.CREATED).json(detailsOfProduct);
    } catch (error) {
      await transaction.rollback();
      next(error);
    }
  }

  /**
   * Deletes a product and its details from the database in a single transaction
   * @param {Object} req - Express request object
   * @param {string} req.params.id - Product ID to delete
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   * @returns {Promise<void>} Returns empty response with 204 status on success
   * @throws {Error} BAD_REQUEST (400) - If product ID is missing
   * @throws {Error} NOT_FOUND (404) - If product doesn't exist
   * @throws {Error} INTERNAL_SERVER_ERROR (500) - If deletion fails
   * @transaction Uses transaction to ensure data consistency across both tables
   */
  async removeProduct(req, res, next) {
    const id = req.params?.id;
    const transaction = await models.sequelize.transaction();

    try {
      if (!id) {
        const error = new Error(errorMessage.ID_VALUE_MISSING);
        error.statusCode = HttpStatus.BAD_REQUEST;

        logger.error("Product deletion failed: ", {
          error: error.message,
          statusCode: error.statusCode,
        });
        throw error;
      }

      // Check if product exists
      const productExists = await this.completeProductDetails(id);

      if (!productExists) {
        const error = new Error(errorMessage.PRODUCT_NOT_FOUND);
        error.statusCode = HttpStatus.NOT_FOUND;
        throw error;
      }

      await models.product_detail
        .destroy({
          where: {
            product_id: {
              [op.eq]: id,
            },
          },
        })
        .then(async (response) => {
          await models.product
            .destroy({
              where: {
                id: {
                  [op.eq]: id,
                },
              },
            })
            .then(async (response) => {
              //   if (response && response["length"] > 0) {
              //     textHeaderData = "Fetched Products ";
              //     textBodyData =
              //       "Product id : " +
              //       id +
              //       " have been removed from retail database";

              //     mailOptions.subject = textHeaderData;
              //     mailOptions.body = textBodyData;
              //     mailOptions.html = HTML_TEMPLATE(textHeaderData, textBodyData);

              //     mailer(mailOptions, (info) => {
              //       logger.info("Email sent successfully");
              //       logger.info("MESSAGE ID: ", info.messageId);
              //     });
              //   }

              // Commit the transaction
              await transaction.commit();

              return response;
            })
            .catch((error) => {
              throw error;
            });
        })
        .catch((error) => {
          throw error;
        });

      return res.status(HttpStatus.NO_CONTENT).json();
    } catch (error) {
      await transaction.rollback();
      next(error);
    }
  }

  /**
   * Retrieves a specific product by ID with all its details
   * @param {Object} req - Express request object
   * @param {string} req.params.id - Product ID to fetch
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   * @returns {Promise<Object>} Object containing:
   *   - success: {boolean} - true if operation was successful
   *   - message: {string} - "Product found successfully"
   *   - data: {Object} Product object with all details including:
   *     - product_id: {number}
   *     - product_name: {string}
   *     - product_description: {string}
   *     - price: {number}
   *     - stocks: {number}
   *     - inward_date: {string} ISO date
   *     - expiry_date: {string} ISO date
   *     - created_at: {string} ISO datetime
   *     - updated_at: {string} ISO datetime
   * @throws {Error} NOT_FOUND (404) - If product doesn't exist
   * @throws {Error} INTERNAL_SERVER_ERROR (500) - If fetch operation fails
   */
  async fetchSpecificProduct(req, res, next) {
    try {
      const productId = req.params?.id;

      const response = await this.completeProductDetails(productId);

      if (!response) {
        const error = new Error(errorMessage.PRODUCT_NOT_FOUND);
        error.statusCode = HttpStatus.NOT_FOUND;
        throw error;
      }

      return res.status(HttpStatus.OK).json({
        success: true,
        message: "Product found successfully",
        data: response,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Retrieves all products with their details from the database
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   * @returns {Promise<Object>} Object containing:
   *   - success: {boolean} - true if operation was successful
   *   - message: {string} - "All products and its details fetched successfully"
   *   - data: {Array<Object>} Array of products with their details, each containing:
   *     - product_id: {number}
   *     - product_name: {string}
   *     - product_description: {string}
   *     - price: {number}
   *     - stocks: {number}
   *     - inward_date: {string} ISO date
   *     - expiry_date: {string} ISO date
   *     - created_at: {string} ISO datetime
   *     - updated_at: {string} ISO datetime
   * @throws {Error} INTERNAL_SERVER_ERROR (500) - If fetch operation fails
   */
  async fetchProducts(req, res, next) {
    try {
      const response = await models.product.findAll({
        attributes: [
          [
            models.sequelize.cast(
              models.sequelize.col("product.id"),
              "INTEGER"
            ),
            "product_id",
          ],
          [models.sequelize.col("product_name"), "product_name"],
          [models.sequelize.col("product_description"), "product_descritpion"],
          [
            models.sequelize.cast(
              models.sequelize.col("product_detail.price"),
              "INTEGER"
            ),
            "price",
          ],
          [
            models.sequelize.cast(
              models.sequelize.col("product_detail.stocks"),
              "INTEGER"
            ),
            "stocks",
          ],
          [models.sequelize.col("product_detail.inward_date"), "inward_date"],
          [models.sequelize.col("product_detail.expiry_date"), "expiry_date"],
          [models.sequelize.col("product_detail.created_at"), "created_at"],
          [models.sequelize.col("product_detail.updated_at"), "updated_at"],
        ],
        raw: true,
        order: [["product_id", "DESC"]],
        include: [
          {
            model: models.product_detail,
            attributes: [],
            required: true,
            duplicating: false,
            as: "product_detail",
          },
        ],
      });

      return res.status(HttpStatus.OK).json({
        success: true,
        message: "All products and its details fetched successfully",
        data: response,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Helper function to fetch complete product details by ID
   * @param {string|number} productId - Product ID to fetch details for
   * @returns {Promise<Object|null>} Product object with all details or null if not found
   * @private
   */
  async completeProductDetails(productId) {
    const response = await models.product.findOne({
      attributes: [
        [
          models.sequelize.cast(models.sequelize.col("product.id"), "INTEGER"),
          "product_id",
        ],
        [models.sequelize.col("product_name"), "product_name"],
        [models.sequelize.col("product_description"), "product_descritpion"],
        [
          models.sequelize.cast(
            models.sequelize.col("product_detail.price"),
            "INTEGER"
          ),
          "price",
        ],
        [
          models.sequelize.cast(
            models.sequelize.col("product_detail.stocks"),
            "INTEGER"
          ),
          "stocks",
        ],
        [models.sequelize.col("product_detail.inward_date"), "inward_date"],
        [models.sequelize.col("product_detail.expiry_date"), "expiry_date"],
        [models.sequelize.col("product.created_at"), "created_at"],
        [models.sequelize.col("product.updated_at"), "updated_at"],
      ],
      raw: true,
      order: [["product_id", "ASC"]],
      include: [
        {
          model: models.product_detail,
          attributes: [],
          required: true,
          duplicating: false,
          as: "product_detail",
        },
      ],
      where: {
        id: {
          [op.eq]: productId,
        },
      },
      limit: 1,
    });

    return response;
  }
}

module.exports = new ProductService();
