const nodemailer = require('nodemailer');
const config = require('../config/config.json');

let emailConfig = null;

/**
 * Initialize the email configuration.
 */
emailConfig = {
    host: config.SMTP_CONFIG && config.SMTP_CONFIG.host ? config.SMTP_CONFIG.host : 'localhost',
    port: config.SMTP_CONFIG && config.SMTP_CONFIG.port ? config.SMTP_CONFIG.port : 25,
    auth: {
        user: config.SMTP_CONFIG && config.SMTP_CONFIG.user ? config.SMTP_CONFIG.user : null,
        pass: config.SMTP_CONFIG && config.SMTP_CONFIG.password ? config.SMTP_CONFIG.password : null,
    }
};

/**
 * Send an email using the configured email settings.
 * @param {string} to - Recipient email address.
 * @param {string} subject - Email subject.
 * @param {string} message - HTML content for the email message.
 * @returns {Promise<void>} A Promise that resolves when the email is sent successfully.
 */
function sendEmail(to, subject, message) {
    return new Promise((resolve, reject) => {
        let transporter = null;
        if (config.SMTP == true) {
            if (!emailConfig) {
                return Promise.reject(new Error('Email configuration is not initialized. update config file to set up the email configuration.'));
            }
            // Create a Nodemailer transporter with the provided email configuration
            transporter = nodemailer.createTransport(emailConfig);
        } else {
            transporter = nodemailer.createTransport({
                sendmail: true,
                newline: 'unix',
                path: '/usr/sbin/sendmail'
            });
        }
        // Email data with HTML message
        const mailOptions = {
            from: config.SMTP_CONFIG.user,
            to: to,
            subject: subject,
            html: message
        };

        // Send the email
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Email could not be sent:', error);
                reject(error);
            } else {
                console.log('Email sent:', info.response);
                resolve();
            }
        });
    });
}

module.exports = {
    sendEmail,
};
