const { Router } = require('express');
const userController = require('../../controller/user.controller');
const userValidator = require('../../validator/user.validator');
const upload = require('../../helper/media.helper');
const router = Router();

/** Get all user's */
router.get('/list', userController.getListOfUser);

/**Change Password after login */
router.post('/change-password', userValidator.changePassword(),  userController.changePassword);

/**Check validations*/
router.post('/check-validation', userValidator.checkValidation(),  userController.checkValidation);

/** Delete user api*/
router.delete('/delete-user/:userId',  userController.deleteUser);

router.post('/html-to-string', userController.convertHtmlToString);

/**upload Profile */
router.post('/profile-upload/:userId',  upload.single('avatar'), userController.profileUpload);

module.exports = router;

/**
* @swagger
* /v1/private/list:
*   get:
*     summary: Get a list of users
*     tags: [User]
*     security:
*       - bearerAuth: []
*     parameters:
*       - in: header
*         name: Accept-Language
*         description: The preferred language for the response.
*         required: false
*         schema:
*           type: string
*     responses:
*       200:
*         description: Successful response with a list of users
*         content:
*           application/json:
*             example:
*               status: true
*               message: Users fetched successfully
*               data:
*                 - userId: 1
*                   username: user1
*                 - userId: 2
*                   username: user2
*                 # Add more user objects as needed
*       400:
*         description: Bad request or error while fetching users
*         content:
*           application/json:
*             example:
*               status: false
*               message: Error message describing the issue
*/
/**
* @swagger
* /v1/private/change-password:
*   post:
*     summary: Change user password after login
*     tags: [User]
*     parameters:
*       - in: header
*         name: Accept-Language
*         description: The preferred language for the response.
*         required: false
*         schema:
*           type: string
*     security:
*       - bearerAuth: []
*     requestBody:
*       description: Old and new password
*       required: true
*       content:
*         application/json:
*           example:
*             oldPassword: userPassword123
*             newPassword: newPassword123
*     responses:
*       200:
*         description: Password change successful
*         content:
*           application/json:
*             example:
*               status: true
*               message: Password change successfully.
*       401:
*         description: Invalid old password or new password matches the old password
*         content:
*           application/json:
*             example:
*               status: false
*               message: Invalid or Match password.
*       500:
*         description: Internal server error
*         content:
*           application/json:
*             example:
*               status: false
*               message: Internal server error.
*/
/**
* @swagger
* /v1/private/check-validation:
*   post:
*     summary: Check if a value exists in the database
*     tags: [User]
*     parameters:
*       - in: header
*         name: Accept-Language
*         description: The preferred language for the response.
*         required: false
*         schema:
*           type: string
*     security:
*       - bearerAuth: []
*     requestBody:
*       description: Validation data
*       required: true
*       content:
*         application/json:
*           example:
*             key: email
*             value: john.doe@example.com
*     responses:
*       200:
*         description: Validation successful
*         content:
*           application/json:
*             example:
*               status: true
*               message: Validation successful
*       400:
*         description: Validation failed
*         content:
*           application/json:
*             example:
*               status: false
*               message: Value already exists in the database
*       500:
*         description: Server error
*         content:
*           application/json:
*             example:
*               status: false
*               message: Server error message
*/
/**
* @swagger
* tags:
*   name: Authentication
*   description: Authentication APIs
* /v1/private/delete-user/{userId}:
*   delete:
*     summary: Delete a user by ID
*     tags: [User]
*     security:
*       - bearerAuth: []
*     parameters:
*       - in: header
*         name: Accept-Language
*         description: The preferred language for the response.
*         required: false
*         schema:
*           type: string
*       - in: path
*         name: userId
*         required: true
*         description: ID of the user to be deleted
*         schema:
*           type: integer
*     responses:
*       200:
*         description: User deleted successfully
*         content:
*           application/json:
*             example:
*               status: true
*               message: User deleted successfully
*       400:
*         description: User not found
*         content:
*           application/json:
*             example:
*               status: false
*               message: User not found
*       404:
*         description: User not found
*         content:
*           application/json:
*             example:
*               status: false
*               message: User not found
*       500:
*         description: Server error
*         content:
*           application/json:
*             example:
*               status: false
*               message: Server error message
*/
/**
* @swagger
* tags:
*   name: User
*   description: User-related APIs
* /v1/private/profile-upload/{userId}:
*   post:
*     summary: Upload profile image for a user
*     tags: [User]
*     parameters:
*       - in: path
*         name: userId
*         description: ID of the user
*         required: true
*         schema:
*           type: integer
*     security:
*       - bearerAuth: []
*     requestBody:
*       description: Profile image to upload
*       required: true
*       content:
*         multipart/form-data:
*           schema:
*             type: object
*             properties:
*               profileImage:
*                 type: string
*                 format: binary
*     responses:
*       200:
*         description: Successful response with profile image details
*         content:
*           application/json:
*             example:
*               status: true
*               message: Profile image uploaded successfully
*               data: http://example.com/uploads/user123_profile.jpg
*       400:
*         description: Bad request or image not selected
*         content:
*           application/json:
*             example:
*               status: false
*               message: Image not selected
*       404:
*         description: User not found
*         content:
*           application/json:
*             example:
*               status: false
*               message: User not found
*       500:
*         description: Internal server error
*         content:
*           application/json:
*             example:
*               status: false
*               message: Server error during image upload
*/
/**
 * @swagger
 * tags:
 *   name: HTML
 *   description: HTML Conversion APIs
 * /v1/private/html-to-string:
 *   post:
 *     summary: Convert HTML to string
 *     tags: [HTML]
 *     parameters:
 *       - in: header
 *         name: Accept-Language
 *         description: The preferred language for the response.
 *         required: false
 *         schema:
 *           type: string
 *     requestBody:
 *       description: HTML content to be converted
 *       required: true
 *       content:
 *         text/html:
 *           example: "<html><body><h1>Hello, World!</h1></body></html>"
 *     responses:
 *       200:
 *         description: Successful response with converted text
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: HTML converted successfully
 *               data: "<html><body><h1>Hello, World!</h1></body></html>"
 *       400:
 *         description: Bad request, HTML content is required
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: HTML content is required.
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: Server error while converting HTML
 */
