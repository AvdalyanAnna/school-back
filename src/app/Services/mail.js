var nodemailer = require('nodemailer')
require('dotenv').config()

export default class Mail {

    constructor() {
        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'username',
                pass: 'password',
            },
        })
    }

    sendMail(mailOptions) {
        return this.transporter.sendMail(mailOptions)
    }

    sendMailToUser(user, subject, text) {
        const mailOptions = {
            from: process.env.SMTP_MAIL,
            to: user.email,
            subject,
            text,
        }

        return this.sendMail(mailOptions)
    }
}