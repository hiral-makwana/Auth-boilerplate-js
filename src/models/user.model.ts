import { Model, Sequelize, DataTypes } from 'sequelize';

let attributes: any = {};

/** User enum  for status*/
export enum status {
    ACTIVE = 'active',
    DEACTIVE = 'deactive',
    DELETED = 'deleted'
}
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&+=!]).{8,}$/;

let keys = {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    firstName: {
        type: DataTypes.STRING
    },
    email: {
        type: DataTypes.STRING
    },
    password: {
        type: DataTypes.STRING,
        validate: {
            isStrongPassword(value: string) {
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
        defaultValue: 'deactive'
    },
    isVerified: {
        type: DataTypes.BOOLEAN
    },
    roleId: {
        type: DataTypes.INTEGER
    }
}

class User extends Model
    implements User { }

export const initUser: any = (modelName: string, sequelize: any, fields?: any) => {
    if (fields) {
        for (const [fieldName, type] of Object.entries(fields)) {
            attributes[fieldName] = {
                type: Sequelize[String(type).toUpperCase()],
            };
        }
        global.customFields = fields
    }
    attributes = { ...keys, ...attributes }

    User.init(attributes, {
        sequelize: sequelize,
        tableName: modelName,
    }).sync({ alter: true }).then((r: any) => {
        console.log("Sync true", r);
    }).catch((e: any) => { throw new Error(e) });
}

export default User