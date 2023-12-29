const { celebrate, Joi, Segments } = require('celebrate');
const i18n = require('../helper/locale.helper');
const { passwordRegex } = require('../helper/constant');

const validateSchema = (schema) => {
    return async (req, res, next) => {
        const language = req.headers['accept-language'] || 'en';
        // Set the language for i18n
        i18n.setLocale(language);
        try {
            let messages;
            // Dynamically load messages based on the selected language
            messages = await require(`./messages/${language}`);
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
    password: Joi.string().pattern(passwordRegex)
        .message('Password should include at least one uppercase letter, one lowercase letter, one digit, and be at least 8 characters long.').required(),
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
exports.forgotPassword = () => validateSchema(Joi.object().keys({
    email: Joi.string().email().required()
}))
exports.resetPassword = () => validateSchema(Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().pattern(passwordRegex)
        .message('Password should include at least one uppercase letter, one lowercase letter, one digit, and be at least 8 characters long.').required()
}))
exports.login = () => validateSchema(Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required()
}))
exports.refreshTokens = () => validateSchema(Joi.object().keys({
    token: Joi.any().required()
}))
