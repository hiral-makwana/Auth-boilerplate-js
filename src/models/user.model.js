const { Model } = require('sequelize');
const student = require('c:/users/admin/desktop/alltasks/node-mysql/models/student');

/** User enum for status*/
const status = {
    ACTIVE: 'active',
    DEACTIVE: 'deactive',
    DELETED: 'deleted',
};
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&+=!]).{8,}$/;

module.exports = (sequelize, DataTypes) => {
    class User extends Model {
    };
    User.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        firstName: {
            type: DataTypes.STRING,
        },
        email: {
            type: DataTypes.STRING,
        },
        password: {
            type: DataTypes.STRING,
            validate: {
                isStrongPassword(value) {
                    if (!PASSWORD_REGEX.test(value)) {
                        throw new Error(
                            'Password must have at least one uppercase letter, one lowercase letter, one digit, one special character, and be at least 8 characters long.'
                        );
                    }
                },
            },
        },
        status: {
            type: DataTypes.ENUM,
            values: Object.values(status),
            defaultValue: 'deactive',
        },
        isVerified: {
            type: DataTypes.BOOLEAN,
        },
        roleId: {
            type: DataTypes.INTEGER,
        }
    },
        {
            sequelize,
            tableName: "users",
            modelName: 'User'
        });

    return User
};