"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initUserMeta = void 0;
const sequelize_1 = require("sequelize");
let keys = {
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    userId: {
        type: sequelize_1.DataTypes.INTEGER
    },
    key: {
        type: sequelize_1.DataTypes.STRING
    },
    value: {
        type: sequelize_1.DataTypes.STRING
    },
    createdBy: {
        type: sequelize_1.DataTypes.INTEGER
    },
    updatedBy: {
        type: sequelize_1.DataTypes.INTEGER
    },
};
class UserMeta extends sequelize_1.Model {
}
const initUserMeta = (sequelize) => {
    UserMeta.init(keys, {
        sequelize: sequelize,
        tableName: 'user_meta',
        modelName: 'userMeta',
    }).sync({ alter: true }).then((r) => {
        console.log("Sync true", r);
    }).catch((e) => { throw new Error(e); });
};
exports.initUserMeta = initUserMeta;
exports.default = UserMeta;
//# sourceMappingURL=userMeta.model.js.map