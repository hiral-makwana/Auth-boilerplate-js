import { Sequelize } from 'sequelize';
import { UserLib } from "./interfaces";
import { Joi } from "celebrate";
import bcrypt from 'bcrypt';
import fs from 'fs'
import handlebars from 'handlebars';
import { sendEmail } from '../helper/emailConfig'

export function setSequelizeInstance(instance: Sequelize) {
    global.sequelize = instance
}
const getModels = () => {
    return UserLib
}

const dynamicFieldFunction = (customFields?: Object, validate?: Boolean) => {
    return Object.entries(customFields || {}).map(([fieldName, fieldType]) => {
        if (Joi.isSchema(fieldType)) {
            return { [fieldName]: fieldType };
        }

        let schema: any;
        // Create schema based on field type
        switch (String(fieldType).toUpperCase()) {
            case 'STRING':
                schema = Joi.string().allow(null, "");
                break;
            case 'INTEGER':
                schema = Joi.number().integer().allow(null);
                break;
            case 'BOOLEAN':
                schema = Joi.boolean();
                break;
            case 'ARRAY':
                schema = Joi.array().items(Joi.any()).allow(null);
                break;
            case 'DATE':
                schema = Joi.date().allow(null, "");
                break;
            default:
                throw new Error(`Unsupported field type: ${fieldType}`);
        }

        return { [fieldName]: validate ? schema.required() : schema };
    });
};


const generateRandomOtp = async (n: any) => {
    if (n <= 0) return 0;
    const min = Math.pow(10, n - 1);
    const max = Math.pow(10, n) - 1;
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

const generateHash = async (password: any) => {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
}
const readHTMLFile = function (path: any, cb: any) {
    fs.readFile(path, 'utf-8', function (err, data) {
        if (err) {
            console.log(err)
            throw err;
        } else {
            cb(null, data);
        }
    });
}
const generateOtpHtmlMessage = async (to: any, custom: any, template: any, emailSubject: any, templateData: any) => {
    return new Promise((resolve, reject) => {
        if (custom == 'true') {
            const compiledTemplate = handlebars.compile(template);
            const htmlToSend = compiledTemplate(templateData);
            const subject = emailSubject;
            sendEmail(to, subject, htmlToSend)
            resolve(true);
        }
        else {
            readHTMLFile(template, (err: any, html: any) => {
                if (err) {
                    console.error(`Error reading HTML file: ${err.message}`);
                    reject(err);
                } else {
                    const compiledTemplate = handlebars.compile(html);
                    const htmlToSend = compiledTemplate(templateData);
                    const subject = emailSubject;
                    //const htmlMessage = html.replace('<%= otpCode %>', otpCode);
                    sendEmail(to, subject, htmlToSend)
                    resolve(true);
                }
            });
        }
    });
}

function convertHtmlToString(html: any) {
    try {
        if (!html) {
            throw new Error('HTML content is required.');
        }

        const text = JSON.stringify(html);
        return { status: true, message: 'HTML converted to string successfully.', result: text };
    } catch (error) {
        return { status: false, message: error.message || 'Error converting HTML to string.' };
    }
}

function updateConfigFromJson(filePath: any) {
    try {
        const configFile = fs.readFileSync(filePath, 'utf-8');
        const config = JSON.parse(configFile);

        for (const key in config) {
            process.env[key] = config[key];
        }

        console.log('Configuration updated successfully.');
    } catch (error) {
        console.error('Error updating configuration:', error.message);
    }
}

export { getModels, dynamicFieldFunction, generateRandomOtp, generateHash, generateOtpHtmlMessage, convertHtmlToString, updateConfigFromJson }