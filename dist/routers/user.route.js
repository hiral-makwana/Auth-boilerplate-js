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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const userController = __importStar(require("../controller/user.controller"));
const user_validator_1 = __importDefault(require("../validator/user.validator"));
const validatorMessage_1 = __importDefault(require("../middleware/validatorMessage"));
const i18n_1 = __importDefault(require("../helper/i18n"));
const verifyToken_1 = require("../middleware/verifyToken");
/**
 * @param {RoutesInterface} options
 */
function createRoutes(options) {
    const router = express_1.default.Router();
    router.use(body_parser_1.default.json());
    router.use(i18n_1.default.init);
    /** Get all user's */
    router.get('/list', userController.getListOfUser);
    /**user Registration */
    router.post('/register', options && options.registerUser &&
        options.registerUser.validator && Object.keys(options.registerUser.validator).length ?
        user_validator_1.default.registerUser(options.registerUser.validator, options.validator) :
        user_validator_1.default.registerUser(global.customFields, options === null || options === void 0 ? void 0 : options.validator), (options === null || options === void 0 ? void 0 : options.registerUser) && options.registerUser.controller ? options.registerUser.controller : userController.registerUser);
    /**verify otp received in email */
    router.post('/verifyOtp', user_validator_1.default.verifyOTP(), userController.verifyOTP);
    /**Resend OTP on email */
    router.post('/resendOtp', user_validator_1.default.resendOTP(), userController.resendOTP);
    /**Forgot password using Email */
    router.post('/forgotPassword', user_validator_1.default.forgotPw(), userController.forgotPassword);
    /**Reset password */
    router.post('/resetPassword', user_validator_1.default.resetPw(), userController.resetPassword);
    /** Login */
    router.post('/login', user_validator_1.default.login(), userController.logIn);
    /**Change Password after login */
    router.post('/changePassword', user_validator_1.default.changePw(), verifyToken_1.verifyToken, userController.changePassword);
    /**Check validations*/
    router.post('/checkValidation', user_validator_1.default.checkValid(), userController.checkValidation);
    /** Delete user api*/
    router.delete('/deleteUser/:userId', userController.deleteUser);
    /** file upload */
    router.put('/updateEmailConfig', user_validator_1.default.emailConfig(), userController.updateConfig);
    router.post('/htmlToString', userController.convertHtmlToString);
    router.use(validatorMessage_1.default);
    return router;
}
exports.default = createRoutes;
//# sourceMappingURL=user.route.js.map