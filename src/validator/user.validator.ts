import { celebrate, Joi, Segments } from 'celebrate';
import { Request, Response, NextFunction } from 'express-serve-static-core';
import { dynamicFieldFunction } from '../helper/utils';
import i18n from '../helper/i18n';
import { ObjectSchema } from 'joi';

const validateSchema = (schema: ObjectSchema<any>) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        const language = req.headers['accept-language'] || 'en';

        // Set the language for i18n
        i18n.setLocale(language);
        try {
            let messages: any;
            // Dynamically load messages based on the selected language
            messages = await import(`../messages/${language}`);
            celebrate({ [Segments.BODY]: schema }, {
                abortEarly: false,
                messages: messages.default || {},
            })(req, res, next);
        } catch (error) {
            console.error(`Error loading messages for language ${language}:`, error);
            // Default to an empty object if messages cannot be loaded
            celebrate({ [Segments.BODY]: schema }, {
                abortEarly: false,
                messages: {},
            })(req, res, next);
        }
    };
};
export default {
    registerUser: (customFields?: Object, validate?: Boolean) => {
        const defaultSchema = Joi.object().keys({
            firstName: Joi.string().required().allow("", null),
            email: Joi.string().email().required(),
            password: Joi.string().pattern(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@#$%^&+=!])(?!.*\s).{8,}$/)
                .message('Password must contain upper, lower, digit, 8+ chars.').required(),
            status: Joi.string(),
            isVerified: Joi.number(),
            roleId: Joi.number()
        }).unknown();

        let customSchema = Joi.object()
        if (customFields && Object.keys(customFields).length > 0) {
            const schemas = dynamicFieldFunction(customFields, validate)
            customSchema = Joi.object().keys(Object.assign({}, ...schemas));
        }
        const schema = defaultSchema.concat(customSchema)
        return validateSchema(schema);
    },

    verifyOTP: () => validateSchema(
        Joi.object().keys({
            type: Joi.string(),
            email: Joi.string().email().required(),
            otp: Joi.number().required()
        })
    ),

    resendOTP: () => validateSchema(
        Joi.object().keys({
            type: Joi.string(),
            email: Joi.string().email().required()
        })
    ),

    forgotPw: () => validateSchema(
        Joi.object().keys({
            email: Joi.string().email().required()
        })
    ),

    resetPw: () => validateSchema(
        Joi.object().keys({
            email: Joi.string().email().required(),
            password: Joi.string().pattern(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@#$%^&+=!])(?!.*\s).{8,}$/)
                .message('Password must contain upper, lower, digit, 8+ chars.').required()
        })
    ),

    login: () => validateSchema(
        Joi.object().keys({
            email: Joi.string().email().required(),
            password: Joi.string().required()
        })
    ),

    changePw: () => validateSchema(
        Joi.object().keys({
            oldPassword: Joi.string().required(),
            newPassword: Joi.string().pattern(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@#$%^&+=!])(?!.*\s).{8,}$/)
                .message('Password must contain upper, lower, digit, 8+ chars.').required()
        })
    ),

    checkValid: () => validateSchema(
        Joi.object().keys({
            value: Joi.any().required()
        })
    ),

    emailConfig: () => validateSchema(
        Joi.object().keys({
            host: Joi.string().required(),
            port: Joi.number().required(),
            user: Joi.string().required(),
            password: Joi.string().required()
        })
    )
}

// Function to generate validation for custom fields dynamically
function generateCustomFieldValidations(customFields: any) {
    const customValidations: any = {};

    if (customFields) {
        for (const [fieldName, type] of Object.entries(customFields)) {
            // Assert 'type' to a string before using it as an index
            if (typeof type === 'string' && Joi[type.toLowerCase()]) {
                customValidations[fieldName] = Joi[type.toLowerCase()]().required();
            } else {
                // Handle invalid 'type' here
                console.error(`Invalid validation type '${type}' for field '${fieldName}'`);
            }
        }
    }
    return customValidations;
}
