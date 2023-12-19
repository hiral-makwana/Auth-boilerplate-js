const { Router } = require('express');
const userController = require('../controller/user.controller');
const userValidator = require('../validator/user.validator');
const { verifyToken } = require('../middleware/verifyToken');

const router = Router();

/**user Registration */
router.post('/register', userValidator.registerUser(), userController.registerUser);

/**verify otp received in email */
router.post('/verifyOtp', userValidator.verifyOTP(), userController.verifyOTP);

/**Resend OTP on email */
router.post('/resendOtp', userValidator.resendOTP(), userController.resendOTP);

/**Forgot password using Email */
router.post('/forgotPassword', userValidator.forgotPw(), userController.forgotPassword);

/**Reset password */
router.post('/resetPassword', userValidator.resetPw(), userController.resetPassword);

/** Login */
router.post('/login', userValidator.login(), userController.logIn);

module.exports = router;
