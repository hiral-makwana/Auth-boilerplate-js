import user, { initUser } from './user.model';
import { initRole } from './role.model';
import { initUserMeta } from './userMeta.model';
const { Sequelize: sqls } = require('sequelize');

/**
 * Create and initialize a model based on the provided parameters.
 * @param {string} modelName - Name of the model to create.
 * @param {typeof sqls} sequelize - Sequelize instance.
 * @param {Object} fields - Custom fields to add to the model (if any).
 * @returns {Model} - The created model.
 */
export const createModel = (modelName: string, sequelize: typeof sqls, fields?: {}) => {
    initUser(modelName, sequelize, fields);
    initRole(sequelize);
    initUserMeta(sequelize);

    return user;
}
