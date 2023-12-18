const { celebrate, Joi, Segments } = require('celebrate');
const i18n = require('../helper/i18n');

const validateSchema = (schema) => {
    return async (req, res, next) => {
        const language = req.headers['accept-language'] || 'en';
        // Set the language for i18n
        i18n.setLocale(language);
        try {
            let messages;
            // Dynamically load messages based on the selected language
            messages = await require(`../messages/${language}`);
            celebrate({ [Segments.BODY]: schema }, {
                abortEarly: false,
                messages: messages.default || {},
            })(req, res, next);
        }
        catch (error) {
            console.error(`Error loading messages for language ${language}:`, error);
            // Default to an empty object if messages cannot be loaded
            celebrate({ [Segments.BODY]: schema }, {
                abortEarly: false,
                messages: {},
            })(req, res, next);
        }
    };
};
exports.registerUser = () => validateSchema(Joi.object().keys({
    firstName: Joi.string().required().allow("", null),
    email: Joi.string().email().required(),
    password: Joi.string().pattern(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@#$%^&+=!])(?!.*\s).{8,}$/)
        .message('Password must contain upper, lower, digit, 8+ chars.').required(),
    status: Joi.string(),
    isVerified: Joi.number(),
    roleId: Joi.number()
}).unknown());

exports.verifyOTP = () => validateSchema(Joi.object().keys({
    type: Joi.string(),
    email: Joi.string().email().required(),
    otp: Joi.number().required()
}))
exports.resendOTP = () => validateSchema(Joi.object().keys({
    type: Joi.string(),
    email: Joi.string().email().required()
}))
exports.forgotPw = () => validateSchema(Joi.object().keys({
    email: Joi.string().email().required()
}))
exports.resetPw = () => validateSchema(Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().pattern(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@#$%^&+=!])(?!.*\s).{8,}$/)
        .message('Password must contain upper, lower, digit, 8+ chars.').required()
}))
exports.login = () => validateSchema(Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required()
}))
exports.changePw = () => validateSchema(Joi.object().keys({
    oldPassword: Joi.string().required(),
    newPassword: Joi.string().pattern(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@#$%^&+=!])(?!.*\s).{8,}$/)
        .message('Password must contain upper, lower, digit, 8+ chars.').required()
}))
exports.checkValid = () => validateSchema(Joi.object().keys({
    value: Joi.any().required()
}))
exports.emailConfig = () => validateSchema(Joi.object().keys({
    host: Joi.string().required(),
    port: Joi.number().required(),
    user: Joi.string().required(),
    password: Joi.string().required()
}))

// Function to generate validation for custom fields dynamically
function generateCustomFieldValidations(customFields) {
    const customValidations = {};
    if (customFields) {
        for (const [fieldName, type] of Object.entries(customFields)) {
            // Assert 'type' to a string before using it as an index
            if (typeof type === 'string' && Joi[type.toLowerCase()]) {
                customValidations[fieldName] = Joi[type.toLowerCase()]().required();
            }
            else {
                // Handle invalid 'type' here
                console.error(`Invalid validation type '${type}' for field '${fieldName}'`);
            }
        }
    }
    return customValidations;
}
