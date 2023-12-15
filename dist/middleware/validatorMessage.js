"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const celebrate_1 = require("celebrate");
const HandleErrorMessage = (err, req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if ((0, celebrate_1.isCelebrateError)(err)) {
            let errorBody = {};
            if (err.details.get('body')) {
                errorBody = err.details.get('body');
            }
            else if (err.details.get('query')) {
                errorBody = err.details.get('query');
            }
            else if (err.details.get('headers')) {
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
                }
                else if (customMessages[validationType]) {
                    return res.status(400).send({ status: false, message: customMessages[validationType] });
                }
                else {
                    // Fallback to Celebrate error message
                    return res.status(400).send({ status: false, message: errorMessage });
                }
            }
        }
    }
    catch (e) {
        return res.status(400).send({ status: false, message: e.message });
    }
});
exports.default = HandleErrorMessage;
//# sourceMappingURL=validatorMessage.js.map