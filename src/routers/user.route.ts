import express from 'express';
import bodyParser from 'body-parser';
import * as userController from '../controller/user.controller';
import { RoutesInterface } from '../helper/interfaces';
import userValidator from '../validator/user.validator'
import HandleErrorMessage from '../middleware/validatorMessage';
import i18n from '../helper/i18n'
import { verifyToken } from '../middleware/verifyToken';

/**
 * @param {RoutesInterface} options
 */
function createRoutes(options?: RoutesInterface) {
    const router = express.Router();
    router.use(bodyParser.json());
    router.use(i18n.init);
    /** Get all user's */
    router.get('/list', userController.getListOfUser)

    /**user Registration */

    router.post('/register', options && options.registerUser &&
        options.registerUser.validator && Object.keys(options.registerUser.validator).length ?
        userValidator.registerUser(options.registerUser.validator, options.validator) :
        userValidator.registerUser(global.customFields, options?.validator),
        options?.registerUser && options.registerUser.controller ? options.registerUser.controller : userController.registerUser)

    /**verify otp received in email */
    router.post('/verifyOtp', userValidator.verifyOTP(), userController.verifyOTP)

    /**Resend OTP on email */
    router.post('/resendOtp', userValidator.resendOTP(), userController.resendOTP)

    /**Forgot password using Email */
    router.post('/forgotPassword', userValidator.forgotPw(), userController.forgotPassword)

    /**Reset password */
    router.post('/resetPassword', userValidator.resetPw(), userController.resetPassword)

    /** Login */
    router.post('/login', userValidator.login(), userController.logIn)

    /**Change Password after login */
    router.post('/changePassword', userValidator.changePw(), verifyToken, userController.changePassword)

    /**Check validations*/
    router.post('/checkValidation', userValidator.checkValid(), userController.checkValidation)

    /** Delete user api*/
    router.delete('/deleteUser/:userId', userController.deleteUser)

    /** file upload */
    router.put('/updateEmailConfig', userValidator.emailConfig(), userController.updateConfig)

    router.post('/htmlToString', userController.convertHtmlToString)
    router.use(HandleErrorMessage)
    return router;
}

export default createRoutes