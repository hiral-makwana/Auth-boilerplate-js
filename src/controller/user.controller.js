const { User, UserMeta } = require('../models');
const bcrypt = require('bcrypt');
const { sendEmail } = require('../helper/email.helper');
const { keyName, requestType } = require("../helper/constant");
const { generateRandomOtp, generateHash, generateOtpHtmlMessage } = require('../helper/utils');
const { status } = require('../helper/constant');
const { generateToken } = require('../helper/auth.helper');
const config = require('../config/config.json');
const { Sequelize, Op } = require('sequelize');
const path = require('path');

const otpHtmlTemplatePath = path.join('src/email_templates', 'otpTemplate.html');
const resendOtpTemplatePath = path.join('src/email_templates', 'resendOtpTemplate.html');

exports.getListOfUser = async (req, res) => {
    try {
        let getUsersData = await User.findAll({ where: { isDeleted: { [Op.or]: [null, 0] } } });
        return res.status(200).send({ status: true, message: res.__("SUCCESS_FETCHED"), data: getUsersData });
    } catch (e) {
        return res.status(500).send({ status: false, message: res.__("SERVER_ERR", e.message) });
    }
};

exports.registerUser = async (req, res) => {
    try {
        const reqData = req.body;
        let jsonObj = {
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
        jsonObj.password = hashedPassword;
        let user = await User.findOne({ where: { email: reqData.email } });
        if (user && user.status == status.DEACTIVE) {
            await User.update(jsonObj, { where: { email: reqData.email } });
            return res.status(200).send({ status: true, message: res.__("SUCCESS_UPDATE") });
        } else if (user && user.status == status.ACTIVE) {
            return res.status(200).send({ status: true, message: res.__("ALREADY_REGISTERED") });
        } else {
            let createUser = await User.create(jsonObj);
            if (createUser) {
                let getRandomOtp = await generateRandomOtp(6);
                let metaObj = {
                    userId: createUser.dataValues.id,
                    key: keyName,
                    value: getRandomOtp.toString()
                };
                await UserMeta.create(metaObj);
                let customOtpHtmlTemplate = otpHtmlTemplatePath;
                if (config.CUSTOM_TEMPLATE == true) {
                    if (reqData.customOtpHtmlTemplate == undefined || reqData.customOtpHtmlTemplate == '') {
                        return res.status(200).send({ status: true, message: res.__("TEMPLATE_NOT_DEFINE") });
                    } else {
                        customOtpHtmlTemplate = reqData.customOtpHtmlTemplate;
                    }
                }
                const templatedata = {
                    username: jsonObj.firstName,
                    otpCode: getRandomOtp
                };
                const otpHtmlMessage = await generateOtpHtmlMessage(jsonObj.email, config.CUSTOM_TEMPLATE, customOtpHtmlTemplate, "Registration done successfully. Here is your OTP for verification.", templatedata);

                return res.status(200).send({ status: true, message: res.__("SUCCESS_CREATE") });
            } else {
                return res.status(500).send({ status: false, message: res.__("FAIL_CREATE") });
            }
        }
    } catch (e) {
        console.log(e);
        return res.status(500).send({ status: false, message: res.__("SERVER_ERR", e.message) });
    }
};

exports.verifyOTP = async (req, res) => {
    try {
        const { type, email, otp } = req.body;

        if (type !== requestType.REGISTER) {
            return res.status(400).json({
                status: false,
                message: res.__("INVALID_TYPE") + `'${requestType.REGISTER}'`,
            });
        }

        const user = await User.findOne({ where: { email }, raw: true });

        if (!user) {
            return res.status(404).json({
                status: false,
                message: res.__("USER_NOT_FOUND"),
            });
        }
        const userMeta = await UserMeta.findOne({ where: { userId: user.id, key: keyName } });
        if (!userMeta || userMeta.value !== otp.toString()) {
            return res.status(400).json({
                status: false,
                message: res.__("INVALID_OTP"),
            });
        }

        await User.update({ status: status.ACTIVE, isVerified: true }, { where: { email } });
        await UserMeta.update({ value: null }, { where: { userId: user.id, key: keyName } })
        return res.status(200).json({
            status: true,
            message: res.__("OTP_VERIFIED"),
            isVerified: true,
            loginType: requestType.REGISTER,
        });
    } catch (e) {
        return res.status(500).json({
            status: false,
            message: res.__("SERVER_ERR") + e.message,
        });
    }
};

exports.resendOTP = async (req, res) => {
    try {
        const { type, email, customOtpHtmlTemplate } = req.body;

        if (type !== requestType.FORGOT) {
            return res.status(400).json({
                status: false,
                message: res.__("INVALID_TYPE") + `'${requestType.FORGOT}'`,
            });
        }

        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(404).json({
                status: false,
                message: res.__("USER_NOT_FOUND"),
            });
        }

        const newOTP = await generateRandomOtp(6);

        await UserMeta.update({ value: newOTP.toString() }, { where: { userId: user.id, key: keyName } });

        let customTemplate = resendOtpTemplatePath;
        if (config.CUSTOM_TEMPLATE == true) {
            if (customOtpHtmlTemplate == undefined || customOtpHtmlTemplate == '') {
                return res.status(200).send({ status: true, message: res.__("TEMPLATE_NOT_DEFINE") });
            } else {
                customTemplate = customOtpHtmlTemplate;
            }
        }
        const templatedata = {
            username: user.firstName,
            otpCode: newOTP
        };
        const otpHtmlMessage = await generateOtpHtmlMessage(user.email, config.CUSTOM_TEMPLATE, customTemplate, "OTP Verification.", templatedata);

        return res.status(200).json({
            status: true,
            message: res.__("SENT_OTP"),
        });
    } catch (e) {
        return res.status(500).json({
            status: false,
            message: res.__("SERVER_ERR") + e.message,
        });
    }
};

exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(404).json({
                status: false,
                message: res.__("USER_NOT_FOUND"),
            });
        }

        const newOTP = await generateRandomOtp(6);

        await UserMeta.update({ value: newOTP.toString() }, {
            where: { userId: user.id, key: keyName },
        });

        const otpHtmlMessage = `<p>Your new OTP code for update password: <b>${newOTP}</b></p>`;
        sendEmail(email, "Forgot Password OTP", otpHtmlMessage);

        return res.status(200).json({
            status: true,
            message: res.__("SENT_OTP"),
        });
    } catch (e) {
        return res.status(500).json({
            status: false,
            message: res.__("SERVER_ERR") + e.message,
        });
    }
};

exports.resetPassword = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(404).json({
                status: false,
                message: res.__("USER_NOT_FOUND"),
            });
        }

        const hashedPassword = await generateHash(password);

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
        return res.status(500).json({
            status: false,
            message: res.__("SERVER_ERR") + e.message,
        });
    }
};

exports.logIn = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(401).json({
                status: false,
                message: res.__("INVALID_EMAIL"),
            });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({
                status: false,
                message: res.__("INVALID_EMAIL"),
            });
        }

        const isVerified = user.isVerified ? true : false;
        if (!isVerified) {
            return res.status(401).json({
                status: false,
                message: res.__("NOT_VERIFIED"),
            });
        }

        const token = await generateToken({ id: user.id, email: user.email });

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
        return res.status(500).json({
            status: false,
            message: res.__("SERVER_ERR") + e.message,
        });
    }
};

exports.changePassword = async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;
        const userId = req.user.id;

        const user = await User.findByPk(userId);

        if (!user) {
            return res.status(404).json({
                status: false,
                message: res.__("USER_NOT_FOUND"),
            });
        }

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

        const hashedNewPassword = await generateHash(newPassword);

        await User.update({ password: hashedNewPassword }, { where: { id: userId } });

        return res.status(200).json({
            status: true,
            message: res.__("CHANGE_PASSWORD"),
        });
    } catch (e) {
        return res.status(500).json({
            status: false,
            message: res.__("SERVER_ERR") + e.message,
        });
    }
};

exports.checkValidation = async (req, res) => {
    try {
        const { key, value } = req.body;

        const userAttributes = Object.keys(User.getAttributes());
        const filteredAttributes = userAttributes.filter(attribute => attribute !== 'createdAt' && attribute !== 'updatedAt');

        const query = {
            [Sequelize.Op.or]: filteredAttributes.map(field => ({
                [field]: value
            }))
        };

        const existingUser = await User.findOne({ where: query });

        if (existingUser) {
            const foundField = userAttributes.find(field => existingUser[field] === value);

            if (foundField !== undefined) {
                return res.status(409).json({
                    status: false,
                    message: `Value '${value}' already exists in the user table in field '${foundField}'.`
                });
            }
        }

        return res.status(200).json({ status: true, message: res.__("VALIDATION_OK") });
    } catch (e) {
        return res.status(500).json({
            status: false,
            message: res.__("SERVER_ERR") + e.message,
        });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const userId = req.params.userId;
        const user = await User.findOne({ where: { id: userId } });

        if (!user) {
            return res.status(404).json({
                status: false,
                message: res.__("USER_NOT_FOUND"),
            });
        }

        if (!config.HARD_DELETE) {
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
                return res.status(404).json({ status: false, message: res.__("USER_NOT_FOUND") });
            }
        } else {
            const result = await User.destroy({ where: { id: userId } });

            if (result === 1) {
                return res.status(200).json({ status: true, message: res.__("USER_DELETED") });
            } else {
                return res.status(404).json({ status: false, message: res.__("USER_NOT_FOUND") });
            }
        }
    } catch (e) {
        return res.status(500).json({
            status: false,
            message: res.__("SERVER_ERR") + e.message,
        });
    }
};

exports.profileUpload = async (req, res) => {
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

        const [updatedRows] = await User.update(
            { profileImage: profileImage.filename },
            { where: { id: userId } }
        );

        if (updatedRows === 0) {
            return res.status(404).json({ status: false, message: res.__('USER_NOT_FOUND') });
        }
        return res.status(200).json({ status: true, message: res.__('IMAGE_UPLOADED'), data: config.BASE_URL + `/${profileImage.destination}` + profileImage.filename });
    } catch (e) {
        return res.status(500).json({
            status: false,
            message: res.__("SERVER_ERR") + e.message,
        });
    }
};

exports.convertHtmlToString = async (req, res) => {
    try {
        let htmlData = '';

        if (req.headers['content-type'] === 'text/html') {
            req.on('data', (chunk) => {
                htmlData += chunk;
            });
            req.on('end', () => {
                if (!htmlData) {
                    return res.status(400).json({ status: false, message: res.__("HTML_REQUIRED") });
                }
                const text = htmlData.replace(/\n/g, '').replace(/\s{2,}/g, ' ');
                res.status(200).json({ success: true, message: res.__('HTML_CONVERTED'), data: text });
            });
        } else {
            res.status(200).json({ success: false, message: 'Invalid content type (Expected text/html). Select HTML for request.' });
        }
    } catch (e) {
        return res.status(500).json({
            status: false,
            message: res.__("SERVER_ERR") + e.message,
        });
    }
};
