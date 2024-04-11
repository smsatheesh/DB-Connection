
'use strict';

const models = require( __dirname ), 
    config = require( __dirname + "/../config/app.config" );

module.exports = ( sequelize, DataTypes ) => {

    const product = sequelize.define("product", {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.BIGINT
        },
        product_name: {
            allowNull: false,
            type: DataTypes.STRING
        },
        product_description: {
            allowNull: true,
            type: DataTypes.BIGINT
        }
    }, {

        timestamps: false,
        hasTrigger: false,
        hasTrigger: false,
        freezeTableName: true,
        schema: config.DB.DB_SCHEMA,
        tableName: "products"
    });

    product.associate = function( models ) {

        product.hasMany( models.product_detail, {
            sourceKey: "id",
            foreignKey: "product_id",
            as: "product_detail"
        });
    }

    return product;
}