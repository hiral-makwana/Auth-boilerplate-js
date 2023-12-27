const { Model } = require('sequelize');
const { passwordRegex } = require('../helper/constant')

/** User enum for status*/
const status = {
    ACTIVE: 'active',
    DEACTIVE: 'deactive',
    DELETED: 'deleted',
};

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
                    if (!passwordRegex.test(value)) {
                        throw new Error(
                            'Password should include at least one uppercase letter, one lowercase letter, one digit, and be at least 8 characters long.'
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
        },
        profileImage: {
            type: DataTypes.STRING
        },
        isDeleted: {
            type: DataTypes.BOOLEAN
        }
    },
        {
            sequelize,
            tableName: "users",
            modelName: 'User'
        });

    return User
};