"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = exports.updateEmailConfig = exports.initEmail = void 0;
const fs_1 = __importDefault(require("fs"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const config_json_1 = __importDefault(require("../config/config.json"));
const path_1 = __importDefault(require("path"));
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
        host: config_json_1.default.mailConfig && config_json_1.default.mailConfig.host ? config_json_1.default.mailConfig.host : 'localhost',
        port: config_json_1.default.mailConfig && config_json_1.default.mailConfig.port ? config_json_1.default.mailConfig.port : 25,
        //secure: config.mailConfig && config.mailConfig?.secure ? config.mailConfig.secure : false,
        auth: {
            user: config_json_1.default.mailConfig && config_json_1.default.mailConfig.user ? config_json_1.default.mailConfig.user : null,
            pass: config_json_1.default.mailConfig && config_json_1.default.mailConfig.password ? config_json_1.default.mailConfig.password : null,
        }
    };
    if (!emailConfig.auth.user || !emailConfig.auth.pass) {
        throw new Error('Email username and password are required in the configuration.');
    }
}
exports.initEmail = initEmail;
/**
 * Update the email configuration dynamically.
 * @param {Object} config - Email configuration object.
 */
function updateEmailConfig(config) {
    const configPath = path_1.default.join('src', 'config.json');
    console.log(configPath);
    try {
        if (!fs_1.default.existsSync(configPath)) {
            return { status: false, message: 'Config file not found.' };
        }
        const configFileContent = fs_1.default.readFileSync(configPath, 'utf-8');
        const currentConfig = JSON.parse(configFileContent);
        if (!currentConfig.mailConfig) {
            return { status: false, message: 'mailConfig object not found in the config file.' };
        }
        currentConfig.mailConfig.host = config.host;
        currentConfig.mailConfig.port = config.port;
        currentConfig.mailConfig.user = config.user;
        currentConfig.mailConfig.password = config.password;
        const updatedConfigContent = JSON.stringify(currentConfig, null, 2);
        fs_1.default.writeFileSync(configPath, updatedConfigContent, 'utf-8');
        return { status: true, message: 'Config updated successfully!' };
    }
    catch (error) {
        console.error('Error updating config:', error);
        throw new Error(error);
    }
}
exports.updateEmailConfig = updateEmailConfig;
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
            transporter = nodemailer_1.default.createTransport(emailConfig);
        }
        else {
            transporter = nodemailer_1.default.createTransport({
                sendmail: true,
                newline: 'unix',
                path: '/usr/sbin/sendmail'
            });
        }
        // Email data with HTML message
        const mailOptions = {
            from: emailConfig.user,
            to: to,
            subject: subject,
            html: message
        };
        // Send the email
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Email could not be sent:', error);
                reject(error);
            }
            else {
                console.log('Email sent:', info.response);
                resolve();
            }
        });
    });
}
exports.sendEmail = sendEmail;
//# sourceMappingURL=emailConfig.js.map