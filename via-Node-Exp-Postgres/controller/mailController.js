const nodemailer = require( 'nodemailer' );

let transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: process.env.user_email,
        pass: process.env.user_password
    }
});

let SEND_MAIL = async ( mailDetails, callBack ) => {

    try {

        const info = await transporter.sendMail(mailDetails);
        callBack( info );
    } catch (error) {
        console.log( error );
    }
}

module.exports = SEND_MAIL;