const { isCelebrateError } = require('celebrate');

/**
 * @typedef {Object} CustomErrorMessages
 * @property {Object} key - The error key.
 * @property {Object} validationType - The validation type.
 * @property {string} message - The error message.
 */

/**
 * Handles error messages for validation errors.
 * @param {any} err - The error object.
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @param {NextFunction} next - The next function.
 */
const handleErrorMessage = async (err, req, res, next) => {
    try {
        if (isCelebrateError(err)) {
            let errorBody = {};
            if (err.details.get('body')) {
                errorBody = err.details.get('body');
            } else if (err.details.get('query')) {
                errorBody = err.details.get('query');
            } else if (err.details.get('headers')) {
                errorBody = err.details.get('headers');
            }
            if (errorBody.details && errorBody.details.length > 0) {
                const firstError = errorBody.details[0];
                const errorKey = firstError.context.key;
                const validationType = firstError.type;
                const errorMessage = firstError.message;

                // Check if custom error messages were provided
                const customMessages = req.body.messages || {};
                if (customMessages[errorKey] && customMessages[errorKey][validationType]) {
                    return res.status(400).send({ status: false, message: customMessages[errorKey][validationType] });
                } else if (customMessages[validationType]) {
                    return res.status(400).send({ status: false, message: customMessages[validationType] });
                } else {
                    // Fallback to Celebrate error message
                    return res.status(400).send({ status: false, message: errorMessage });
                }
            }
        }
    } catch (e) {
        return res.status(400).send({ status: false, message: e.message });
    }
};

module.exports = handleErrorMessage;
