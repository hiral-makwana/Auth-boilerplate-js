const { User } = require('../models');
const bcrypt = require('bcrypt');
const { generateHash } = require('../helper/utils');
const config = require('../config/config.json');
const { Sequelize, Op } = require('sequelize');

exports.getListOfUser = async (req, res) => {
    try {
        let getUsersData = await User.findAll({ where: { isDeleted: { [Op.or]: [null, 0] } } });
        return res.status(200).send({ status: true, message: res.__("SUCCESS_FETCHED"), data: getUsersData });
    } catch (e) {
        return res.status(500).send({ status: false, message: res.__("SERVER_ERR", e.message) });
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
