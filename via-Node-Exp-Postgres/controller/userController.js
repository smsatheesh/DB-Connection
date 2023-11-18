const client = require( "../connection" );
const mailer = require( "./mailController" );
const HTML_TEMPLATE = require("./../middleware/mail-template.js");
let fetchProducts = ( req, res ) => {

    client.query( 
        `
            SELECT * FROM retail_db
        `, 
        ( err, result ) => {

            if( !err ) {

                if( result.rows.length > 0 ) {

                    textHeaderData = "Fetched Products ";
                    textBodyData = "Products have been fetched from retail_db";

                    mailOptions.subject = textHeaderData;
                    mailOptions.body = textBodyData;
                    mailOptions.html = HTML_TEMPLATE( textHeaderData, textBodyData );

                    mailer(mailOptions, (info) => {
                        console.log("Email sent successfully");
                        console.log("MESSAGE ID: ", info.messageId);
                    });
                }
                return res.status(200).send( result.rows );
            } else if( err ) {

                console.log( err.message );
                return res.status(500).send( "Internal server error !!" );
            }else 
                return res.status(404).send( "Bad request" );
        }
    );
};

let fetchProduct = ( req, res ) => {

    client.query(
    `
        SELECT * FROM retail_db WHERE product_id = '${req.params.id}'
    `,
    ( err, result ) => {

        if( !err ) {

            if( result.rows.length > 0 ) {

                textHeaderData = "Fetched Product ";
                textBodyData = `Product id -> '${req.params.id}' have been fetched from retail_db, ${result["rows"][0]["product_name"]} `;

                mailOptions.subject = textHeaderData;
                mailOptions.body = textBodyData;
                mailOptions.html = HTML_TEMPLATE( textHeaderData, textBodyData );

                mailer(mailOptions, (info) => {
                    console.log("Email sent successfully");
                    console.log("MESSAGE ID: ", info.messageId);
                });
            }
            
            res.status(200).send( result.rows );
        } else if( err ) {

            console.log( err.message );
            res.status(500).send( "Internal server error !! " );
        } else 
            res.status(404).send( "Bad request" );
    });
};

let insertProduct = ( req, res ) => {

    let reqBody = req.body;
    console.log( reqBody );
    client.query(
    `
        INSERT INTO retail_db (category, product_name, product_description, price, stocks, inward_date, expiry_date)
        VALUES('${reqBody.category}', '${reqBody.product_name}', '${reqBody.product_description}', '${reqBody.price}', '${reqBody.stocks}', '${reqBody.inward_date}', '${reqBody.expiry_date}' )
    `,
    async ( err, result ) => {

        if( !err ) {

            console.log( "Inserted successfully " );
            
            if( reqBody && reqBody.product_name ) {

                textHeaderData = "Inserted Product ";
                textBodyData = `Product ${reqBody.product_name} have been inserted into retail_db`;

                mailOptions.subject = textHeaderData;
                mailOptions.body = textBodyData;
                mailOptions.html = HTML_TEMPLATE( textHeaderData, textBodyData );

                await mailer(mailOptions, (info) => {
                    console.log("Email sent successfully");
                    console.log("MESSAGE ID: ", info.messageId);
                });
            }
            res.status(200).send( "Inserted successfully !!" );
        } else if( err ) {

            console.log( err.message );
            res.status(500).send( "Internal server error !!" );
        } else 
            res.status(404).send( "Bad request" );
    });
};

let updateProduct = async ( req, res ) => {

    let reqBody = req.body;
    let responseBody;
    responseBody = await client.query(
                    `
                        SELECT * FROM retail_db WHERE product_id = ${req.params.id}
                    `);

    if( responseBody && responseBody.rowCount >= 1 ) {
        
        let updateQuery = '';

        for( const [key, value] of Object.entries( reqBody ) ) {

            if( updateQuery != '' )
                updateQuery += ', ' + `${key} = '${value}'`;
            else
                updateQuery += `${key} = '${value}'`;
        }

        client.query(
        `
            UPDATE retail_db 
                SET 
                    ${updateQuery}
                WHERE
                    product_id = '${req.params.id}'
        `,
        async ( err, result ) => {

            if( !err ) {

                console.log( "Updated successfully" );
                if( responseBody && responseBody.rows && responseBody.rows[0].product_name ) {
                    
                    textHeaderData = "Updated Product ";
                    textBodyData = `Product ${responseBody.rows[0].product_name} have been inserted into retail_db`;

                    mailOptions.subject = textHeaderData;
                    mailOptions.body = textBodyData;
                    mailOptions.html = HTML_TEMPLATE( textHeaderData, textBodyData );

                    await mailer(mailOptions, (info) => {
                        console.log("Email sent successfully");
                        console.log("MESSAGE ID: ", info.messageId);
                    });
                }
                res.status(200).send( "Updated successfully !! " );
            } else if( err ) {
                
                console.log( err.message );
                res.status(500).send( "Internal server error !!" );
            } else
                res.status(404).send( "Bad request" );
        });
    } else {

        res.status(404).send( "Product not exist" );
    }
};

let deleteProduct = ( req, res ) => {

    client.query(
    `
        DELETE FROM retail_db WHERE product_id = ${req.params.id}
    `,
    async ( err, result ) => {

        if( !err ) {

            console.log( "Deleted successfully " );

            textHeaderData = "Deleted Product ";
            textBodyData = `Product have been inserted into retail_db`;

            mailOptions.subject = textHeaderData;
            mailOptions.body = textBodyData;
            mailOptions.html = HTML_TEMPLATE( textHeaderData, textBodyData );

            await mailer(mailOptions, (info) => {
                console.log("Email sent successfully");
                console.log("MESSAGE ID: ", info.messageId);
            });

            res.status(200).send( "Deleted successfully !!" );
        } else if( err ) {

            console.log( err.message );
            res.status( 500 ).send( "Internal server error !!" );
        } else
            res.status(404).send( "Bad request" );
    });
};

var mailOptions = {
    from: process.env.fromEmail,
    to: process.env.toEmail,
    subject: textHeaderData,
    text: textBodyData,
    html: HTML_TEMPLATE( textHeaderData, textBodyData )
};

var textHeaderData, textBodyData;


module.exports = { 
    fetchProducts,
    fetchProduct,
    insertProduct,
    updateProduct,
    deleteProduct
};