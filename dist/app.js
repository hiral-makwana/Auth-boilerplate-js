"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.profileUpload = exports.createUploader = exports.initEmail = exports.updateEmailConfig = exports.swaggerRoute = exports.createRoutes = exports.getModels = exports.createModel = void 0;
const index_1 = require("./models/index");
Object.defineProperty(exports, "createModel", { enumerable: true, get: function () { return index_1.createModel; } });
const index_route_1 = __importDefault(require("./routers/index.route"));
exports.createRoutes = index_route_1.default;
const utils_1 = require("./helper/utils");
Object.defineProperty(exports, "getModels", { enumerable: true, get: function () { return utils_1.getModels; } });
//import { updateSwaggerBasePath } from './docs/swagger'
const swaggerRoute_1 = __importDefault(require("./routers/swaggerRoute"));
exports.swaggerRoute = swaggerRoute_1.default;
const emailConfig_1 = require("./helper/emailConfig");
Object.defineProperty(exports, "updateEmailConfig", { enumerable: true, get: function () { return emailConfig_1.updateEmailConfig; } });
Object.defineProperty(exports, "initEmail", { enumerable: true, get: function () { return emailConfig_1.initEmail; } });
const mediaUpload_1 = require("./helper/mediaUpload");
Object.defineProperty(exports, "createUploader", { enumerable: true, get: function () { return mediaUpload_1.createUploader; } });
const user_controller_1 = require("./controller/user.controller");
Object.defineProperty(exports, "profileUpload", { enumerable: true, get: function () { return user_controller_1.profileUpload; } });
//# sourceMappingURL=app.js.map