"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initRole = void 0;
const sequelize_1 = require("sequelize");
let keys = {
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    roleName: {
        type: sequelize_1.DataTypes.STRING
    },
    createdBy: {
        type: sequelize_1.DataTypes.INTEGER
    },
    updatedBy: {
        type: sequelize_1.DataTypes.INTEGER
    }
};
class Role extends sequelize_1.Model {
}
const initRole = (sequelize) => {
    Role.init(keys, {
        sequelize: sequelize,
        tableName: 'roles',
        modelName: 'role',
    });
    // Synchronize the model with the database
    sequelize.sync()
        .then(() => {
        return Role.findAndCountAll();
    })
        .then(({ count }) => {
        if (count === 0) {
            return Role.bulkCreate([
                { id: 1, roleName: 'Admin', createdBy: null, updatedBy: null },
                { id: 2, roleName: 'User', createdBy: null, updatedBy: null }
            ]);
        }
    })
        .then(() => {
        console.log('Default data inserted into the roles table');
    })
        .catch((e) => {
        throw new Error(e);
    });
};
exports.initRole = initRole;
//# sourceMappingURL=role.model.js.map