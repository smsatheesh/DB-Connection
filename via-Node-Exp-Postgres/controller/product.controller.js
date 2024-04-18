
const sequelize = require( "sequelize" );
const models = require( "../models" );
const op = sequelize.Op;
const config = require( "./../config/app.config.js" );
const mailer = require( "./mail.controller" );
const HTML_TEMPLATE = require( "./../middleware/mail-template" );
const print = console.log.bind( console );

let mailOptions = {
    from: config.MAIL.FROM_ADDRESS,
    to: config.MAIL.TO_ADDRESS,
    subject: '',
    text: '',
    html: ''
};

// Adding controller methods
let ProductController = {
    
    buildProducts: async( req, res, next ) => {
    
        const transaction = await models.sequelize.transaction();

        try {

            if( req.body[ "length" ] > 0 ) {

                let payLoadForProuct = [], payLoadForProductDetails = [];
                let product_creation_response;

                for( let element of req.body ) {

                    payLoadForProuct.push({
                        product_name: element[ "name" ],
                        product_description: element[ "description" ] 
                    });

                    payLoadForProductDetails.push({
                        product_name: element[ "name" ],
                        price: element[ "price" ],
                        stocks: element[ "stocks" ],
                        inward_date: new Date( Date.now() ),
                        expiry_date: element[ "expiry_date" ]
                    });
                }

                await models.product.bulkCreate( payLoadForProuct, { raw: true }, { transaction })
                    .then(( response ) => {

                        if( response && response[ "length" ] > 0 ) {
                            textHeaderData = "Inserted Products ";
                            textBodyData = "Products have been inserted into retail database";
        
                            mailOptions.subject = textHeaderData;
                            mailOptions.body = textBodyData;
                            mailOptions.html = HTML_TEMPLATE( textHeaderData, textBodyData );
        
                            mailer( mailOptions, ( info ) => {
                                print("Email sent successfully");
                                print("MESSAGE ID: ", info.messageId);
                            });
                        }
        
                        product_creation_response = response;
                    })
                    .catch( async ( error ) => {
                        await transaction.rollback();
                        throw error;
                    });


                for( let unq_values of product_creation_response ) {

                    for( let innr_loop = 0; innr_loop < payLoadForProductDetails[ "length" ]; innr_loop++ ) {

                        if( payLoadForProductDetails[ innr_loop ][ "product_name" ] == unq_values[ "dataValues" ][ "product_name" ] )
                            payLoadForProductDetails[ innr_loop ][ "product_id" ] = unq_values[ "dataValues" ][ "id" ];
                    }
                }

                await models.product_detail.bulkCreate( payLoadForProductDetails, { raw: true }, { transaction });

                await transaction.commit();
                return res.status( 201 ).send( "Data created successfully !" );
            } else
                return res.status( 200 ).send( "No product details exists !" );

        } catch( error ) {
            await transaction.rollback();
            next( error );
            return res.status( 500 ).send( error.message );
        }
    },

    reviseProduct: async( req, res, next ) => {

        const transaction = await models.sequelize.transaction();

        try {

            if( req.body && req.body[ "id" ] ) {

                let updateObject = {
                    id: req.body.id,
                    price: req.body.price,
                    stocks: req.body.stocks,
                    expiry_date: req.body.expiry_date
                }

                await models.product_detail.update( updateObject, 
                    { 
                        where: { 
                            id: { 
                                [ op.eq ]: req.body.id 
                            } 
                        } 
                    }, { transaction })
                .then( async ( response ) => {
                    await transaction.commit();

                    if( response && response[ "length" ] > 0 ) {
                        textHeaderData = "Updated Product";
                        textBodyData = "Product id :  " + updateObject[ "id" ] + " have been updated in retail database";

                        mailOptions.subject = textHeaderData;
                        mailOptions.body = textBodyData;
                        mailOptions.html = HTML_TEMPLATE( textHeaderData, textBodyData );

                        mailer( mailOptions, (info) => {
                            print("Email sent successfully");
                            print("MESSAGE ID: ", info.messageId);
                        });
                    }

                    return res.status( 200 ).send( "Updated successfully !" );
                })
                .catch(( error ) => {
                    throw error;
                });
            } else {
                throw "id not exits";
            }

        } catch( error ) {
            await transaction.rollback();
            next( error );
            return res.status( 500 ).send( error.message? error.message: error );
        }
    },

    removeProduct: async( req, res, next ) => {

        const transaction = await models.sequelize.transaction();

        try {

            if( req.body && req.params[ "id" ] ) {

                await models.product_detail.destroy({
                    where: {
                        id: {
                            [ op.eq ]: req.params[ "id" ]
                        }
                    }
                })
                .then( async ( response ) => {

                    await models.product.destroy({
                        where: {
                            id: {
                                [ op.eq ]: req.params[ "id" ]
                            }
                        }
                    })
                    .then( async ( response ) => {
                            
                        await transaction.commit();

                        if( response && response[ "length" ] > 0 ) {
                            textHeaderData = "Fetched Products ";
                            textBodyData = "Product id : " + req.params[ "id" ] + " have been removed from retail database";

                            mailOptions.subject = textHeaderData;
                            mailOptions.body = textBodyData;
                            mailOptions.html = HTML_TEMPLATE( textHeaderData, textBodyData );

                            mailer( mailOptions, ( info ) => {
                                print("Email sent successfully");
                                print("MESSAGE ID: ", info.messageId);
                            });
                        }

                        return res.status( 200 ).send( "Deleted successfully !" );
                    })
                    .catch(( error ) => {
                        throw error;
                    });
                })
                .catch(( error ) => {
                    throw error;
                });

            } else {
                throw "id not exits"
            }

        } catch( error ) {
            await transaction.rollback();
            next( error );
            return res.status( 500 ).send( error.message );
        }
    },

    fetchProducts: async ( req, res, next ) => {
        
        try {

            await models.product.findAll({
                attributes: [
                    [ models.sequelize.col( "product.id" ), "product_id" ],
                    [ models.sequelize.col( "product_name" ), "product_name" ],
                    [ models.sequelize.col( "product_description" ), "product_descritpion" ],
                    [ models.sequelize.col( "product_detail.price" ), "price" ],
                    [ models.sequelize.col( "product_detail.stocks" ), "stocks" ],
                    [ models.sequelize.col( "product_detail.inward_date" ), "inward_date" ],
                    [ models.sequelize.col( "product_detail.expiry_date" ), "expiry_date" ]
                ],
                raw: true,
                order: [
                    [ "id", "ASC" ]
                ],
                include: [
                    {
                        model: models.product_detail,
                        attributes: [],
                        required: true,
                        duplicating: false,
                        as: "product_detail"
                    }
                ]
            })
            .then(( response ) => {

                if( response && response[ "length" ] > 0 ) {
                    textHeaderData = "Fetched Products ";
                    textBodyData = "Products have been fetched from retail database";

                    mailOptions.subject = textHeaderData;
                    mailOptions.body = textBodyData;
                    mailOptions.html = HTML_TEMPLATE( textHeaderData, textBodyData );

                    mailer( mailOptions, ( info ) => {
                        print("Email sent successfully");
                        print("MESSAGE ID: ", info.messageId);
                    });
                }

                return res.status( 200 ).json( response );
            })
            .catch(( error ) => {
                throw error;
            });
        } catch( error ) {
            next( error );
            return res.status( 500 ).send( error.message );
        }
    },

    fetchSpecificProduct: async ( req, res, next ) => {

        try {

            const product_id = req.params.id;

            await models.product.findOne({
                attributes: [
                    [ models.sequelize.col( "product.id" ), "product_id" ],
                    [ models.sequelize.col( "product_name" ), "product_name" ],
                    [ models.sequelize.col( "product_description" ), "product_descritpion" ],
                    [ models.sequelize.col( "product_detail.price" ), "price" ],
                    [ models.sequelize.col( "product_detail.stocks" ), "stocks" ],
                    [ models.sequelize.col( "product_detail.inward_date" ), "inward_date" ],
                    [ models.sequelize.col( "product_detail.expiry_date" ), "expiry_date" ]
                ],
                raw: true,
                order: [
                    [ "id", "ASC" ]
                ],
                include: [
                    {
                        model: models.product_detail,
                        attributes: [],
                        required: true,
                        duplicating: false,
                        as: "product_detail"
                    }
                ],
                where: {
                    id: {
                        [ op.eq ]: product_id
                    }
                },
                limit: 1
            })
            .then(( response ) => {

                if( response && response[ "length" ] > 0 ) {
                    textHeaderData = "Fetched Product " + response[ "product_name" ];
                    textBodyData = "Product " + response[ "product_name" ] + " have been fetched from retail database";

                    mailOptions.subject = textHeaderData;
                    mailOptions.body = textBodyData;
                    mailOptions.html = HTML_TEMPLATE( textHeaderData, textBodyData );

                    mailer( mailOptions, ( info ) => {
                        print("Email sent successfully");
                        print("MESSAGE ID: ", info.messageId);
                    });
                }

                return res.status( 200 ).send( response );
            })
            .catch(( error ) => {
                return res.status( 500 ).send( error.message );
            });

        } catch( error ) {
            next( error );
            return res.status( 500 ).send( error.message ); 
        }
    } 
}

module.exports = ProductController;