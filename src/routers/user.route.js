const { Router } = require('express');
const userController = require('../controller/user.controller');
const userValidator = require('../validator/user.validator');
const { verifyToken } = require('../middleware/verifyToken');
const upload = require('../helper/mediaUpload');
const router = Router();

/** Get all user's */
router.get('/list', userController.getListOfUser);

/**Change Password after login */
router.post('/changePassword', userValidator.changePw(), verifyToken, userController.changePassword);

/**Check validations*/
router.post('/checkValidation', userValidator.checkValid(), verifyToken, userController.checkValidation);

/** Delete user api*/
router.delete('/deleteUser/:userId', verifyToken, userController.deleteUser);

router.post('/htmlToString', userController.convertHtmlToString);

/**upload Profile */
router.post('/upload/:userId', verifyToken, upload.single('avatar'), userController.profileUpload);

module.exports = router;
