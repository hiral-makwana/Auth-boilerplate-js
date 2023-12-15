"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initUser = exports.status = void 0;
const sequelize_1 = require("sequelize");
let attributes = {};
/** User enum  for status*/
var status;
(function (status) {
    status["ACTIVE"] = "active";
    status["DEACTIVE"] = "deactive";
    status["DELETED"] = "deleted";
})(status || (exports.status = status = {}));
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&+=!]).{8,}$/;
let keys = {
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    firstName: {
        type: sequelize_1.DataTypes.STRING
    },
    email: {
        type: sequelize_1.DataTypes.STRING
    },
    password: {
        type: sequelize_1.DataTypes.STRING,
        validate: {
            isStrongPassword(value) {
                if (!PASSWORD_REGEX.test(value)) {
                    throw new Error('Password must have at least one uppercase letter, one lowercase letter, one digit, one special character, and be at least 8 characters long.');
                }
            },
        },
    },
    status: {
        type: sequelize_1.DataTypes.ENUM,
        values: Object.values(status),
        defaultValue: 'deactive'
    },
    isVerified: {
        type: sequelize_1.DataTypes.BOOLEAN
    },
    roleId: {
        type: sequelize_1.DataTypes.INTEGER
    }
};
class User extends sequelize_1.Model {
}
const initUser = (modelName, sequelize, fields) => {
    if (fields) {
        for (const [fieldName, type] of Object.entries(fields)) {
            attributes[fieldName] = {
                type: sequelize_1.Sequelize[String(type).toUpperCase()],
            };
        }
        global.customFields = fields;
    }
    attributes = Object.assign(Object.assign({}, keys), attributes);
    User.init(attributes, {
        sequelize: sequelize,
        tableName: modelName,
    }).sync({ alter: true }).then((r) => {
        console.log("Sync true", r);
    }).catch((e) => { throw new Error(e); });
};
exports.initUser = initUser;
exports.default = User;
//# sourceMappingURL=user.model.js.map