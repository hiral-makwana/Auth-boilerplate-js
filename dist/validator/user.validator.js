"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const celebrate_1 = require("celebrate");
const utils_1 = require("../helper/utils");
const i18n_1 = __importDefault(require("../helper/i18n"));
const validateSchema = (schema) => {
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const language = req.headers['accept-language'] || 'en';
        // Set the language for i18n
        i18n_1.default.setLocale(language);
        try {
            let messages;
            // Dynamically load messages based on the selected language
            messages = yield Promise.resolve(`${`../messages/${language}`}`).then(s => __importStar(require(s)));
            (0, celebrate_1.celebrate)({ [celebrate_1.Segments.BODY]: schema }, {
                abortEarly: false,
                messages: messages.default || {},
            })(req, res, next);
        }
        catch (error) {
            console.error(`Error loading messages for language ${language}:`, error);
            // Default to an empty object if messages cannot be loaded
            (0, celebrate_1.celebrate)({ [celebrate_1.Segments.BODY]: schema }, {
                abortEarly: false,
                messages: {},
            })(req, res, next);
        }
    });
};
exports.default = {
    registerUser: (customFields, validate) => {
        const defaultSchema = celebrate_1.Joi.object().keys({
            firstName: celebrate_1.Joi.string().required().allow("", null),
            email: celebrate_1.Joi.string().email().required(),
            password: celebrate_1.Joi.string().pattern(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@#$%^&+=!])(?!.*\s).{8,}$/)
                .message('Password must contain upper, lower, digit, 8+ chars.').required(),
            status: celebrate_1.Joi.string(),
            isVerified: celebrate_1.Joi.number(),
            roleId: celebrate_1.Joi.number()
        }).unknown();
        let customSchema = celebrate_1.Joi.object();
        if (customFields && Object.keys(customFields).length > 0) {
            const schemas = (0, utils_1.dynamicFieldFunction)(customFields, validate);
            customSchema = celebrate_1.Joi.object().keys(Object.assign({}, ...schemas));
        }
        const schema = defaultSchema.concat(customSchema);
        return validateSchema(schema);
    },
    verifyOTP: () => validateSchema(celebrate_1.Joi.object().keys({
        type: celebrate_1.Joi.string(),
        email: celebrate_1.Joi.string().email().required(),
        otp: celebrate_1.Joi.number().required()
    })),
    resendOTP: () => validateSchema(celebrate_1.Joi.object().keys({
        type: celebrate_1.Joi.string(),
        email: celebrate_1.Joi.string().email().required()
    })),
    forgotPw: () => validateSchema(celebrate_1.Joi.object().keys({
        email: celebrate_1.Joi.string().email().required()
    })),
    resetPw: () => validateSchema(celebrate_1.Joi.object().keys({
        email: celebrate_1.Joi.string().email().required(),
        password: celebrate_1.Joi.string().pattern(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@#$%^&+=!])(?!.*\s).{8,}$/)
            .message('Password must contain upper, lower, digit, 8+ chars.').required()
    })),
    login: () => validateSchema(celebrate_1.Joi.object().keys({
        email: celebrate_1.Joi.string().email().required(),
        password: celebrate_1.Joi.string().required()
    })),
    changePw: () => validateSchema(celebrate_1.Joi.object().keys({
        oldPassword: celebrate_1.Joi.string().required(),
        newPassword: celebrate_1.Joi.string().pattern(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@#$%^&+=!])(?!.*\s).{8,}$/)
            .message('Password must contain upper, lower, digit, 8+ chars.').required()
    })),
    checkValid: () => validateSchema(celebrate_1.Joi.object().keys({
        value: celebrate_1.Joi.any().required()
    })),
    emailConfig: () => validateSchema(celebrate_1.Joi.object().keys({
        host: celebrate_1.Joi.string().required(),
        port: celebrate_1.Joi.number().required(),
        user: celebrate_1.Joi.string().required(),
        password: celebrate_1.Joi.string().required()
    }))
};
// Function to generate validation for custom fields dynamically
function generateCustomFieldValidations(customFields) {
    const customValidations = {};
    if (customFields) {
        for (const [fieldName, type] of Object.entries(customFields)) {
            // Assert 'type' to a string before using it as an index
            if (typeof type === 'string' && celebrate_1.Joi[type.toLowerCase()]) {
                customValidations[fieldName] = celebrate_1.Joi[type.toLowerCase()]().required();
            }
            else {
                // Handle invalid 'type' here
                console.error(`Invalid validation type '${type}' for field '${fieldName}'`);
            }
        }
    }
    return customValidations;
}
//# sourceMappingURL=user.validator.js.map