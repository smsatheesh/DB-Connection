"use strict";

const models = require(__dirname),
  config = require(__dirname + "/../config/app.config");

module.exports = (sequelize, DataTypes) => {
  const product = sequelize.define(
    "product",
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.BIGINT,
      },
      product_name: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      product_description: {
        allowNull: true,
        type: DataTypes.STRING,
      },
      created_at: {
        allowNull: true,
        type: DataTypes.DATE,
      },
      updated_at: {
        allowNull: false,
        type: DataTypes.DATE,
      },
    },
    {
      timestamps: true,
      hasTrigger: false,
      freezeTableName: true,
      schema: config.DB.DB_SCHEMA,
      tableName: "products",
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );

  product.associate = function (models) {
    product.hasMany(models.product_detail, {
      sourceKey: "id",
      foreignKey: "product_id",
      as: "product_detail",
    });
  };

  return product;
};
