const fs = require('fs');
const nodemailer = require('nodemailer');
const config = require('../config/config.json');
const path = require('path');
let emailConfig = null;

/**
 * Initialize the email configuration.
 */
emailConfig = {
    host: config.mailConfig && config.mailConfig.host ? config.mailConfig.host : 'localhost',
    port: config.mailConfig && config.mailConfig.port ? config.mailConfig.port : 25,
    auth: {
        user: config.mailConfig && config.mailConfig.user ? config.mailConfig.user : null,
        pass: config.mailConfig && config.mailConfig.password ? config.mailConfig.password : null,
    }
};

/**
 * Update the email configuration dynamically.
 * @param {Object} newConfig - Email configuration object.
 */
function updateEmailConfig(newConfig) {
    const configPath = path.join('src', 'config.json');
    console.log(configPath);
    try {
        if (!fs.existsSync(configPath)) {
            return { status: false, message: 'Config file not found.' };
        }

        const configFileContent = fs.readFileSync(configPath, 'utf-8');
        const currentConfig = JSON.parse(configFileContent);

        if (!currentConfig.mailConfig) {
            return { status: false, message: 'mailConfig object not found in the config file.' };
        }

        currentConfig.mailConfig.host = newConfig.host;
        currentConfig.mailConfig.port = newConfig.port;
        currentConfig.mailConfig.user = newConfig.user;
        currentConfig.mailConfig.password = newConfig.password;

        const updatedConfigContent = JSON.stringify(currentConfig, null, 2);

        fs.writeFileSync(configPath, updatedConfigContent, 'utf-8');

        return { status: true, message: 'Config updated successfully!' };
    } catch (error) {
        console.error('Error updating config:', error);
        throw new Error(error);
    }
}

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
        if (process.env.SMTP == 'true') {
            if (!emailConfig) {
                return Promise.reject(new Error('Email configuration is not initialized. Call initEmail() to set up the email configuration.'));
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
            from: config.mailConfig.user,
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
    updateEmailConfig,
    sendEmail,
};
