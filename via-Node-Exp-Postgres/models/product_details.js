
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
            alllowNull: false,
            type: DataTypes.BIGINT
        },
        price: {
            allowNull: false,
            type: DataTypes.BIGINT
        },
        stocks: {
            allowNull: false,
            type: DataTypes.BIGINT,
            defaultValue: "1"
        },
        inward_date: {
            allowNull: false,
            type: 'TIMESTAMP',
            defaultValue: sequelize.NOW
        },
        expiry_date: {
            alllowNull: false,
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

    product_detail.associate = function( models ) {

        product_detail.belongsTo( models.product, {
            sourceKey: "id",
            foreignKey: "product_id",
            as: "product"
        });
    }

    return product_detail;
} 