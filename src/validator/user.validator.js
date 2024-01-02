const { Joi } = require('celebrate');
const { passwordRegex } = require('../helper/constant');
const { validateSchema } = require('../helper/utils');

exports.changePassword = () => validateSchema(Joi.object().keys({
    oldPassword: Joi.string().required(),
    newPassword: Joi.string().pattern(passwordRegex)
        .message('Password should include at least one uppercase letter, one lowercase letter, one digit, and be at least 8 characters long.').required()
}))
exports.checkValidation = () => validateSchema(Joi.object().keys({
    value: Joi.any().required()
}))
