import fs from 'fs';
import nodemailer from 'nodemailer';
import config from '../config/config.json';
import path from 'path';
let emailConfig = null;

/**
 * Initialize the email configuration.
 */
function initEmail() {
    if (emailConfig) {
        throw new Error('Email configuration is already initialized. Call updateEmailConfig() to modify settings.');
    }

    // if (!config || typeof config !== 'object') {
    //     throw new Error('Invalid email configuration. Provide an email configuration object.');
    // }

    emailConfig = {
        host: config.mailConfig && config.mailConfig.host ? config.mailConfig.host : 'localhost',
        port: config.mailConfig && config.mailConfig.port ? config.mailConfig.port : 25,
        //secure: config.mailConfig && config.mailConfig?.secure ? config.mailConfig.secure : false,
        auth: {
            user: config.mailConfig && config.mailConfig.user ? config.mailConfig.user : null,
            pass: config.mailConfig && config.mailConfig.password ? config.mailConfig.password : null,
        }
    };

    if (!emailConfig.auth.user || !emailConfig.auth.pass) {
        throw new Error('Email username and password are required in the configuration.');
    }
}

/**
 * Update the email configuration dynamically.
 * @param {Object} config - Email configuration object.
 */
function updateEmailConfig(config: any) {
    const configPath = path.join('src', 'config.json');
    console.log(configPath);
    try {
        if (!fs.existsSync(configPath)) {
            return { status: false, message: 'Config file not found.' }
        }

        const configFileContent = fs.readFileSync(configPath, 'utf-8');
        const currentConfig = JSON.parse(configFileContent);

        if (!currentConfig.mailConfig) {
            return { status: false, message: 'mailConfig object not found in the config file.' }
        }

        currentConfig.mailConfig.host = config.host;
        currentConfig.mailConfig.port = config.port;
        currentConfig.mailConfig.user = config.user;
        currentConfig.mailConfig.password = config.password;

        const updatedConfigContent = JSON.stringify(currentConfig, null, 2);

        fs.writeFileSync(configPath, updatedConfigContent, 'utf-8');

        return { status: true, message: 'Config updated successfully!' }
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
function sendEmail(to: any, subject: string, message: any) {
    return new Promise<void>((resolve, reject) => {
        let transporter = null;
        if (process.env.SMTP == 'true') {
            if (!emailConfig) {
                return Promise.reject(new Error('Email configuration is not initialized. Call initEmail() to set up the email configuration.'));
            }
            // Create a Nodemailer transporter with the provided email configuration
            transporter = nodemailer.createTransport(emailConfig);
        }
        else {
            transporter = nodemailer.createTransport({
                sendmail: true,
                newline: 'unix',
                path: '/usr/sbin/sendmail'
            })
        }
        // Email data with HTML message
        const mailOptions = {
            from: emailConfig.user,
            to: to,
            subject: subject,
            html: message
        };

        // Send the email
        transporter.sendMail(mailOptions, (error: any, info: { response: any; }) => {
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

export {
    initEmail,
    updateEmailConfig,
    sendEmail,
};
