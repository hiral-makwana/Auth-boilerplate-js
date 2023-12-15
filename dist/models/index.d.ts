import user from './user.model';
declare const sqls: any;
/**
 * Create and initialize a model based on the provided parameters.
 * @param {string} modelName - Name of the model to create.
 * @param {typeof sqls} sequelize - Sequelize instance.
 * @param {Object} fields - Custom fields to add to the model (if any).
 * @returns {Model} - The created model.
 */
export declare const createModel: (modelName: string, sequelize: typeof sqls, fields?: {}) => typeof user;
export {};
