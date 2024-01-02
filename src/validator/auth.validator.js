const { Joi } = require('celebrate');
const { passwordRegex } = require('../helper/constant');
const { validateSchema } = require('../helper/utils');

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
    type: Joi.string().required(),
    email: Joi.string().email().required(),
    otp: Joi.number().required()
}))
exports.resendOTP = () => validateSchema(Joi.object().keys({
    type: Joi.string().required(),
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
    type: Joi.string().required(),
    token: Joi.any().required()
}))
