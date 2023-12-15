"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createModel = void 0;
const user_model_1 = __importStar(require("./user.model"));
const role_model_1 = require("./role.model");
const userMeta_model_1 = require("./userMeta.model");
const { Sequelize: sqls } = require('sequelize');
/**
 * Create and initialize a model based on the provided parameters.
 * @param {string} modelName - Name of the model to create.
 * @param {typeof sqls} sequelize - Sequelize instance.
 * @param {Object} fields - Custom fields to add to the model (if any).
 * @returns {Model} - The created model.
 */
const createModel = (modelName, sequelize, fields) => {
    (0, user_model_1.initUser)(modelName, sequelize, fields);
    (0, role_model_1.initRole)(sequelize);
    (0, userMeta_model_1.initUserMeta)(sequelize);
    return user_model_1.default;
};
exports.createModel = createModel;
//# sourceMappingURL=index.js.map