const nodemailer = require( 'nodemailer' );
const config = require( "./../config/app.config" )
let print = console.log.bind( console );

let transporter = nodemailer.createTransport({
    service: config.MAIL.SERVICE_NAME,
    host: config.MAIL.SERVICE_HOST,
    port: config.MAIL.SERVICE_PORT,
    secure: false,
    auth: {
        user: config.MAIL.SERVICE_AUTH_USER_MAIL,
        pass: config.MAIL.SERVICE_AUTH_USER_MAIL_PASSWORD
    }
});

let SEND_MAIL = async ( mailDetails, callBack ) => {

    try {

        const info = await transporter.sendMail( mailDetails );
        callBack( info );
    } catch (error) {
        print( error );
    }
}

module.exports = SEND_MAIL;