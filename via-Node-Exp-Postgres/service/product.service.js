const client = require( "../config/connection" );
const print = console.log.bind( console );

function fetchProductService() {

    client.query(
        `
            SELECT * FROM retail_db
        `,
        (err, result) => {

            if (!err) {

                if (result.rows.length > 0) {

                    textHeaderData = "Fetched Products ";
                    textBodyData = "Products have been fetched from retail_db";

                    mailOptions.subject = textHeaderData;
                    mailOptions.body = textBodyData;
                    mailOptions.html = HTML_TEMPLATE(textHeaderData, textBodyData);

                    mailer(mailOptions, (info) => {
                        print("Email sent successfully");
                        print("MESSAGE ID: ", info.messageId);
                    });
                }
                return (result.rows);
            } else if (err) {

                print(err.message);
                return ("Internal server error !!");
            }
            else
                return ("Bad request");
        }
    );
};


module.exports = fetchProductService();