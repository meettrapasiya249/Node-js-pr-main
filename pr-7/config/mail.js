const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'trapasiyameet08@gmail.com',
        pass: 'YAHAN_APNA_16_CHAR_APP_PASSWORD_DALO'
    }
})

module.exports = transporter