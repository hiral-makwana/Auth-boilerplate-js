import { Request } from "express";
import User, { status } from '../models/user.model';
import bcrypt from 'bcrypt';
import { sendEmail, updateEmailConfig } from '../helper/emailConfig'
import { keyName, requestType } from "../helper/constant";
import { generateRandomOtp, generateHash, generateOtpHtmlMessage } from '../helper/utils'
import UserMeta from '../models/userMeta.model';
import { generateToken } from '../helper/jwtToken';
import config from '../config/config.json';
import Sequelize, { Op } from 'sequelize';
import path from 'path';

const otpHtmlTemplatePath = path.join('src', 'otpTemplate.html');
const resendOtpTemplatePath = path.join('src', 'resendOtpTemplate.html');

/**
* @swagger
* tags:
*   name: Users
*   description: User APIs
* /list:
*   get:
*     summary: Get a list of users
*     tags: [Users]
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
export const getListOfUser = async (req: Request, res: any) => {
    try {
        let allData: any = await User.findAll({})
        return res.status(200).send({ status: true, message: res.__("SUCCESS_FETCHED"), data: allData })
    } catch (e) {
        console.log(e);
        return res.status(400).send({ status: false, message: e.message })
    }
}
/**
 * @swagger
 * /register:
 *   post:
 *     summary: Register a new user
 *     tags: [Authentication] 
 *     parameters:
 *       - in: header
 *         name: Accept-Language
 *         description: The preferred language for the response.
 *         required: false
 *         schema:
 *           type: string
 *     requestBody:
 *       description: User registration data
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             messages:
 *               email: "invalid email format"
 *               required: "email is required"
 *             firstName: "Test"
 *             lastName: "User"
 *             email: "user@example.com"
 *             password: "String@123"
 *             phoneNumber: "8965613143"
 *             roleId: 1
 *     responses:
 *       200:
 *         description: Successful response with registration status
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Registartion successfully.
 */
export const registerUser = async (req: any, res: any) => {
    try {
        const reqData = req.body
        let jsonObj: any = {
            firstName: reqData.firstName,
            lastName: reqData.lastName,
            email: reqData.email,
            password: reqData.password,
            phoneNumber: reqData.phoneNumber,
            roleId: reqData.roleId ? reqData.roleId : 2,
            isVerified: false,
            ...reqData
        };

        const hashedPassword = await generateHash(reqData.password);
        jsonObj.password = hashedPassword
        // check if already exists
        let user: any = await User.findOne({ where: { email: reqData.email } });
        if (user && user.status == status.DEACTIVE) {
            await User.update(jsonObj, { where: { email: reqData.email } })
            return res.status(200).send({ status: true, message: res.__("SUCCESS_UPDATE") })
        }
        else if (user && user.status == status.ACTIVE) {
            return res.status(200).send({ status: true, message: res.__("ALREADY_REGISTERED") })
        }
        else {
            let createUser = await User.create(jsonObj)
            if (createUser) {
                // HTML content for the OTP email
                let getRandomOtp = await generateRandomOtp(6)
                let metaObj = {
                    userId: createUser.dataValues.id,
                    key: keyName,
                    value: getRandomOtp.toString()
                }
                await UserMeta.create(metaObj)
                let customOtpHtmlTemplate = otpHtmlTemplatePath
                //process.env.CUSTOM_TEMPLATE == 'true' ? req.body.customOtpHtmlTemplate : otpHtmlTemplatePath;
                if (process.env.CUSTOM_TEMPLATE == 'true') {
                    if (reqData.customOtpHtmlTemplate == undefined || reqData.customOtpHtmlTemplate == '') {
                        return res.status(200).send({ status: true, message: res.__("TEMPLATE_NOT_DEFINE") })
                    }
                    else {
                        customOtpHtmlTemplate = reqData.customOtpHtmlTemplate
                    }
                }
                const templatedata = {
                    username: jsonObj.firstName,
                    otpCode: getRandomOtp
                }
                const otpHtmlMessage = await generateOtpHtmlMessage(jsonObj.email, process.env.CUSTOM_TEMPLATE, customOtpHtmlTemplate, "Registration done successfully.Here is your OTP for varification.", templatedata);

                return res.status(200).send({ status: true, message: res.__("SUCCESS_CREATE") })
            }
            else {
                return res.send({ status: false, message: res.__("FAIL_CREATE") })
            }
        }
    }
    catch (e) {
        console.log(e);
        return res.status(500).send({ status: false, message: res.__("SERVER_ERR", e.message) })
    }
}
/**
* @swagger
* /verifyOTP:
*   post:
*     summary: Verify OTP for user registration
*     tags: [Authentication]
*     parameters:
*       - in: header
*         name: Accept-Language
*         description: The preferred language for the response.
*         required: false
*         schema:
*           type: string
*     requestBody:
*       description: OTP verification data
*       required: true
*       content:
*         application/json:
*           example:
*             type: register
*             email: john.doe@example.com
*             otp: 123456
*     responses:
*       200:
*         description: Successful response with verification status
*         content:
*           application/json:
*             example:
*               status: true
*               message: "Otp is verfied successfully."
*               isVerified: true
*               loginType: register
*       400:
*         description: Invalid request or OTP verification failed
*         content:
*           application/json:
*             example:
*               status: false
*               message: INVALID_TYPE 'register'
*       500:
*         description: Internal server error
*         content:
*           application/json:
*             example:
*               status: false
*               message: Internal server error.
*/
export const verifyOTP = async (req: any, res: any) => {
    try {
        const { type, email, otp } = req.body;

        // Ensure the type is 'register' as specified in the requirement
        if (type !== requestType.REGISTER) {
            return res.status(400).json({
                status: false,
                message: res.__("INVALID_TYPE") + `'${requestType.REGISTER}'`,
            });
        }

        // Find the user with the provided email and status
        const user: any = await User.findOne({ where: { email }, raw: true });

        if (!user) {
            return res.status(400).json({
                status: false,
                message: res.__("USER_NOT_FOUND"),
            });
        }
        if (user && user.status == status.ACTIVE) {
            return res.status(400).json({
                status: false,
                message: res.__("ALREADY_VERIFIED"),
            });
        }

        const userMeta = await UserMeta.findOne({ where: { userId: user.id, key: keyName } });
        if (!userMeta || userMeta.value !== otp.toString()) {
            return res.status(400).json({
                status: false,
                message: res.__("INVALID_OTP"),
            });
        }

        // Update the user's status to 'ACTIVE' or as needed
        await User.update({ status: status.ACTIVE, isVerified: true }, { where: { email } });
        await UserMeta.update({ value: null }, { where: { userId: user.id, key: keyName } })
        return res.status(200).json({
            status: true,
            message: res.__("OTP_VERIFIED"),
            isVerified: true,
            loginType: requestType.REGISTER,
        });
    } catch (e) {
        console.error(e);
        return res.status(500).json({
            status: false,
            message: res.__("SERVER_ERR") + e.message,
        });
    }
}
/**
* @swagger
* /resendOTP:
*   post:
*     summary: Resend OTP for user registration
*     tags: [Authentication]
*     parameters:
*       - in: header
*         name: Accept-Language
*         description: The preferred language for the response.
*         required: false
*         schema:
*           type: string
*     requestBody:
*       description: Resend OTP data
*       required: true
*       content:
*         application/json:
*           example:
*             type: forgot
*             email: john.doe@example.com
*     responses:
*       200:
*         description: Successful response with OTP resend status
*         content:
*           application/json:
*             example:
*               status: true
*               message: OTP sent successfully.
*       400:
*         description: Invalid request or user not found
*         content:
*           application/json:
*             example:
*               status: false
*               message: INVALID_TYPE 'forgot'
*       500:
*         description: Internal server error
*         content:
*           application/json:
*             example:
*               status: false
*               message: Internal server error.
*/
export const resendOTP = async (req: any, res: any) => {
    try {
        const { type, email, customOtpHtmlTemplate } = req.body;

        // Ensure the type is 'forgot' as specified in the requirement
        if (type !== requestType.FORGOT) {
            return res.status(400).json({
                status: false,
                message: res.__("INVALID_TYPE") + `'${requestType.FORGOT}'`,
            });
        }

        const user: any = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(400).json({
                status: false,
                message: res.__("USER_NOT_FOUND"),
            });
        }

        // Generate a new OTP
        const newOTP = await generateRandomOtp(6);

        // Update the user's OTP in the database
        await UserMeta.update({ value: newOTP.toString() }, { where: { userId: user.id, key: keyName } });

        // Send the new OTP to the user's email
        let customTemplate = resendOtpTemplatePath
        if (process.env.CUSTOM_TEMPLATE == 'true') {
            if (customOtpHtmlTemplate == undefined || customOtpHtmlTemplate == '') {
                return res.status(200).send({ status: true, message: res.__("TEMPLATE_NOT_DEFINE") })
            }
            else {
                customTemplate = customOtpHtmlTemplate
            }
        }
        const templatedata = {
            username: user.firstName,
            otpCode: newOTP
        }
        const otpHtmlMessage = await generateOtpHtmlMessage(user.email, process.env.CUSTOM_TEMPLATE, customTemplate, "OTP Verification.", templatedata);


        return res.status(200).json({
            status: true,
            message: res.__("SENT_OTP"),
        });
    } catch (e) {
        console.error(e);
        return res.status(500).json({
            status: false,
            message: res.__("SERVER_ERR") + e.message,
        });
    }
}
/**
* @swagger
* /forgotPassword:
*   post:
*     summary: Send OTP for password reset
*     tags: [Authentication]
*     parameters:
*       - in: header
*         name: Accept-Language
*         description: The preferred language for the response.
*         required: false
*         schema:
*           type: string
*     requestBody:
*       description: Email for password reset OTP
*       required: true
*       content:
*         application/json:
*           example:
*             email: john.doe@example.com
*     responses:
*       200:
*         description: Successful response with OTP sent status
*         content:
*           application/json:
*             example:
*               status: true
*               message: OTP sent successfully.
*       400:
*         description: Invalid request or user not found
*         content:
*           application/json:
*             example:
*               status: false
*               message: User not found.
*       500:
*         description: Internal server error
*         content:
*           application/json:
*             example:
*               status: false
*               message: Internal server error.
*/
export const forgotPassword = async (req: any, res: any) => {
    try {
        const { email } = req.body;

        // Find the user with the provided email
        const user: any = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(400).json({
                status: false,
                message: res.__("USER_NOT_FOUND"),
            });
        }

        // Generate a new OTP
        const newOTP = await generateRandomOtp(6);

        // Update the user's OTP in the user_meta table
        await UserMeta.update({ value: newOTP.toString() }, {
            where: { userId: user.id, key: keyName },
        });

        // Send the new OTP to the user's email
        const otpHtmlMessage = `<p>Your new OTP code for update password: <b>${newOTP}</b></p>`;
        sendEmail(email, "Forgot Password OTP", otpHtmlMessage);

        return res.status(200).json({
            status: true,
            message: res.__("SENT_OTP"),
        });
    } catch (e) {
        console.error(e);
        return res.status(500).json({
            status: false,
            message: res.__("SERVER_ERR") + e.message,
        });
    }
}
/**
* @swagger
* /resetPassword:
*   post:
*     summary: Reset user password
*     tags: [Authentication]
*     parameters:
*       - in: header
*         name: Accept-Language
*         description: The preferred language for the response.
*         required: false
*         schema:
*           type: string
*     requestBody:
*       description: User email and new password
*       required: true
*       content:
*         application/json:
*           example:
*             email: john.doe@example.com
*             password: newPassword123
*     responses:
*       200:
*         description: Successful response with password reset status
*         content:
*           application/json:
*             example:
*               status: true
*               message: Password reset successfully.
*               data:
*                 userId: 123
*                 email: john.doe@example.com
*       400:
*         description: Invalid request or user not found
*         content:
*           application/json:
*             example:
*               status: false
*               message: User not found.
*       500:
*         description: Internal server error
*         content:
*           application/json:
*             example:
*               status: false
*               message: Internal server error.
*/
export const resetPassword = async (req: any, res: any) => {
    try {
        const { email, password } = req.body;

        // Find the user with the provided email
        const user: any = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(400).json({
                status: false,
                message: res.__("USER_NOT_FOUND"),
            });
        }

        //const otpRecord = await UserMeta.findOne({ where: { userId: user.id, key: keyName } });

        // Check if the OTP is valid
        // if () {
        // }

        // Hash the new password
        const hashedPassword = await generateHash(password);

        // Update the user's password and set OTP
        await Promise.all([
            User.update({ password: hashedPassword }, { where: { id: user.id } }),
            UserMeta.update({ value: null }, { where: { userId: user.id, key: keyName } }),
        ]);

        return res.status(200).json({
            status: true,
            message: res.__("RESET_PASSWORD"),
            data: {
                userId: user.id,
                email: user.email,
            },
        });
    } catch (e) {
        console.error(e);
        return res.status(500).json({
            status: false,
            message: res.__("SERVER_ERR") + e.message,
        });
    }
}
/**
 * @swagger
 * /login:
 *   post:
 *     summary: User login
 *     tags: [Authentication]
 *     parameters:
 *       - in: header
 *         name: Accept-Language
 *         description: The preferred language for the response.
 *         required: false
 *         schema:
 *           type: string
 *     requestBody:
 *       description: User email and password
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             email: john.doe@example.com
 *             password: userPassword123
 *     responses:
 *       200:
 *         description: Successful login response with user information and token
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Login successfully.
 *               data:
 *                 userId: 123
 *                 email: john.doe@example.com
 *                 token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTIzLCJlbWFpbCI6ImpvaG4uZG9lQGV4YW1wbGUuY29tIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
 *       401:
 *         description: Invalid email or password
 *         content:
 *           application/json:
 *             example:
 *               status: false
 *               message: Invalid email or password
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             example:
 *               status: false
 *               message: Internal server error.
 */
export const logIn = async (req: any, res: any) => {
    try {
        const { email, password } = req.body;

        // Find the user with the provided email
        const user: any = await User.findOne({ where: { email } });

        // Check if the user exists
        if (!user) {
            return res.status(401).json({
                status: false,
                message: res.__("INVALID_EMAIL")
            });
        }

        // Check if the password
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({
                status: false,
                message: res.__("INVALID_EMAIL")
            });
        }

        const isVerified = user.isVerified ? true : false
        if (!isVerified) {
            return res.status(401).json({
                status: false,
                message: res.__("NOT_VERIFIED")
            });
        }
        //generate a JWT token
        const token = await generateToken({ id: user.id, email: user.email });

        // Return the authentication response
        return res.status(200).json({
            status: true,
            message: res.__("LOGIN_SUCCESS"),
            data: {
                userId: user.id,
                email: user.email,
                token,
            },
        });
    } catch (e) {
        console.error(e);
        return res.status(500).json({
            status: false,
            message: res.__("SERVER_ERR") + e.message,
        });
    }
}
/**
* @swagger
* /changePassword:
*   post:
*     summary: Change user password after login
*     tags: [Authentication]
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
export const changePassword = async (req: any, res: any) => {
    try {
        const { oldPassword, newPassword } = req.body;
        const userId = req.user.id;

        // Find the user by ID
        const user: any = await User.findByPk(userId);

        if (!user) {
            return res.status(401).json({
                status: false,
                message: res.__("USER_NOT_FOUND"),
            });
        }

        // Check if the provided old password matches the hashed password in the database
        const isPasswordValid = await bcrypt.compare(oldPassword, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({
                status: false,
                message: res.__("INVALID_PASSWORD"),
            });
        }

        const isPasswordMatch = await bcrypt.compare(newPassword, user.password);

        if (isPasswordMatch) {
            return res.status(401).json({
                status: false,
                message: res.__("PASSWORD_MATCH"),
            });
        }
        // Hash the new password
        const hashedNewPassword = await generateHash(newPassword);

        // Update the user's password in the database
        await User.update({ password: hashedNewPassword }, { where: { id: userId } });

        return res.status(200).json({
            status: true,
            message: res.__("CHANGE_PASSWORD"),
        });
    } catch (e) {
        console.error(e);
        return res.status(500).json({
            status: false,
            message: res.__("SERVER_ERR") + e.message,
        });
    }
}
/**
* @swagger
* /checkValidation:
*   post:
*     summary: Check if a value exists in the database
*     tags: [Authentication]
*     parameters:
*       - in: header
*         name: Accept-Language
*         description: The preferred language for the response.
*         required: false
*         schema:
*           type: string
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
export const checkValidation = async (req: any, res: any) => {
    try {
        const { key, value } = req.body;

        // Get all attributes (fields) of the User model
        const userAttributes = Object.keys(User.getAttributes());
        const filteredAttributes = userAttributes.filter(attribute => attribute !== 'createdAt' && attribute !== 'updatedAt');

        // Build a dynamic query to check if the specified value exists in any field
        const query = {
            [Sequelize.Op.or]: filteredAttributes.map(field => ({
                [field]: value
            }))
        };
        // Check if the specified value exists in any field of the user table
        const existingUser = await User.findOne({ where: query });

        //check value using given key
        // const keyExists = await User.findOne({ where: { [key]: value } });
        // if (keyExists) {
        //     const fieldWithValue = Object.keys(keyExists.dataValues).find(
        //         (field) => keyExists.dataValues[field] === value
        //     );

        //     if (fieldWithValue) {
        //         return res.status(400).json({
        //             status: false,
        //             message: res.__("VALUE_EXIST") + ` ${fieldWithValue}`,
        //         });
        //     }
        // }

        if (existingUser) {
            // Determine the field where the value was found
            const foundField = userAttributes.find(field => existingUser[field] === value);

            // If foundField is not undefined, a matching field was found
            if (foundField !== undefined) {
                return res.status(409).json({
                    status: false,
                    message: `Value '${value}' already exists in the user table in field '${foundField}'.`
                });
            }
        }
        return res.status(200).json({ status: true, message: res.__("VALIDATION_OK") });
    } catch (e) {
        console.error(e);
        return res.status(500).json({
            status: false,
            message: res.__("SERVER_ERR") + e.message,
        });
    }
}
/**
* @swagger
* tags:
*   name: Authentication
*   description: Authentication APIs
* /deleteUser/{userId}:
*   delete:
*     summary: Delete a user by ID
*     tags: [Users]
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
export const deleteUser = async (req: any, res: any) => {
    try {
        const userId = req.params.userId;
        const user: any = await User.findOne({ where: { id: userId } });
        if (!user) {
            return res.status(400).json({
                status: false,
                message: res.__("USER_NOT_FOUND"),
            });
        }
        if (!process.env.HARD_DELETE) {
            const modelAttributes = Object.keys(User.getAttributes());
            if (!modelAttributes.includes('isDeleted')) {
                return res.status(500).json({ status: false, message: res.__("FIELD_NOT_FOUND") });
            }

            const softDeleteResult = await User.update(
                { isDeleted: true },
                { where: { id: userId, isDeleted: { [Op.or]: [false, null] } } }
            );

            if (softDeleteResult[0] === 1) {
                return res.status(200).json({ status: true, message: res.__("USER_DELETED") });
            } else {
                return res.status(400).json({ status: false, message: res.__("USER_NOT_FOUND") });
            }
        } else {
            const result = await User.destroy({ where: { id: userId } });

            if (result === 1) {
                return res.status(200).json({ status: true, message: res.__("USER_DELETED") });
            } else {
                return res.status(400).json({ status: false, message: res.__("USER_NOT_FOUND") });
            }
        }
    } catch (e) {
        console.error(e);
        return res.status(500).json({
            status: false,
            message: res.__("SERVER_ERR") + e.message,
        });
    }
}
export const profileUpload = async (req: any, res: any) => {
    try {
        const userId = req.params.userId;
        const profileImage = req.file;
        if (!profileImage) {
            return res.status(400).json({ status: false, message: res.__("IMAGE_NOT_SELECTED") });
        }
        const userAttributes = Object.keys(User.getAttributes());
        if (!userAttributes.includes('profileImage')) {
            return res.status(500).json({ status: false, message: res.__('IMAGE_FIELD_NOT_EXIST') });
        }

        console.log(profileImage)
        // Update the profileImage field in the database
        const [updatedRows] = await User.update(
            { profileImage: profileImage.filename },
            { where: { id: userId } }
        );

        if (updatedRows === 0) {
            return res.status(404).json({ status: false, message: res.__('USER_NOT_FOUND') });
        }
        return res.status(200).json({ status: true, message: res.__('IMAGE_UPLOADED'), data: process.env.BASE_URL + `/${profileImage.destination}` + profileImage.filename });
    } catch (e) {
        console.error(e);
        return res.status(500).json({
            status: false,
            message: res.__("SERVER_ERR") + e.message,
        });
    }
}
/**
 * @swagger
 * tags:
 *   name: Config
 *   description: Email Configuration
 * /updateEmailConfig:
 *   put:
 *     summary: Update email configuration
 *     tags: [Config]
 *     parameters:
 *       - in: header
 *         name: Accept-Language
 *         description: The preferred language for the response.
 *         required: false
 *         schema:
 *           type: string
 *     requestBody:
 *       description: New configuration data
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             host: smtp.example.com
 *             port: 587
 *             user: your_username
 *             pass: your_password
 *     responses:
 *       200:
 *         description: Successful response with update status
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: Config updated successfully
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: Error updating config
 */
export const updateConfig = async (req: any, res: any) => {
    try {
        const newConfig = req.body;

        const result = updateEmailConfig(newConfig);

        if (result.status == true) {
            res.status(200).json({ success: true, message: result.message });
        } else {
            res.status(500).json({ success: false, message: result.message });
        }
    } catch (e) {
        console.error(e);
        return res.status(500).json({
            status: false,
            message: res.__("SERVER_ERR") + e.message,
        });
    }
}
/**
 * @swagger
 * tags:
 *   name: HTML
 *   description: HTML Conversion APIs
 * /htmlToString:
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
export const convertHtmlToString = async (req: any, res: any) => {
    try {
        let htmlData = '';

        if (req.headers['content-type'] === 'text/html') {
            //Concatenate chunks of data
            req.on('data', (chunk: any) => {
                htmlData += chunk;
            });
            req.on('end', () => {
                if (!htmlData) {
                    return res.status(400).json({ status: false, message: res.__("HTML_REQUIRED") });
                }
                const text = htmlData.replace(/\n/g, '').replace(/\s{2,}/g, ' '); //JSON.stringify(reqData);
                res.status(200).json({ success: true, message: res.__('HTML_CONVERTED'), data: text });
            });
        }
        else {
            res.status(200).json({ success: false, message: 'Invalid content type(Expected text/html). Select HTML for request.' });
        }
    } catch (e) {
        console.error(e);
        return res.status(500).json({
            status: false,
            message: res.__("SERVER_ERR") + e.message,
        });
    }
}
