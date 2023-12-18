const User = require("../models/user.model");

/**
 * @typedef {Object} dynamicFields
 * @property {any} controller - Controller.
 * @property {Object} validator - Validator object.
 */

/**
 * @typedef {Object} RoutesInterface
 * @property {Object} customErrors - Custom errors.
 * @property {boolean} validator - Validator flag.
 * @property {dynamicFields} registerUser - Register user dynamic fields.
 */

/**
 * UserLib namespace.
 * @namespace
 */
const UserLib = {
    /**
     * Users model.
     * @type {any}
     */
    Users: User,
};

module.exports = { UserLib };
