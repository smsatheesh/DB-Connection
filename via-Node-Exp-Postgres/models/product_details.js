
'use strict';

const models = require( __dirname ), 
    config = require( __dirname + "/../config/app.config" );

module.exports = ( sequelize, DataTypes ) => {

    const product_detail = sequelize.define( "product_detail", {
        id: {
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
            type: DataTypes.BIGINT
        },
        product_id: {
            allowNull: false,
            type: DataTypes.BIGINT
        },
        price: {
            allowNull: false,
            type: DataTypes.BIGINT
        },
        stock: {
            allowNull: true,
            type: DataTypes.BIGINT,
            defaultValue: "1"
        },
        inward_date: {
            allowNull: false,
            type: 'TIMESTAMP',
            defaultValue: sequelize.NOW
        },
        expiry_date: {
            alllowNull: true,
            type: DataTypes.DATE
        }
    }, {
        timestamps: false,
        hasTrigger: false,
        freezeTableName: true,
        schema: config.DB.DB_SCHEMA,
        tableName: "product_details",
        freezeTableName: true
    });

    return product_detail;
} 