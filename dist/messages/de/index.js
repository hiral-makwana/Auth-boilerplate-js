"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const alternatives_1 = __importDefault(require("./alternatives"));
const any_1 = __importDefault(require("./any"));
const arrays_1 = __importDefault(require("./arrays"));
const binary_1 = __importDefault(require("./binary"));
const boolean_1 = __importDefault(require("./boolean"));
const date_1 = __importDefault(require("./date"));
const functions_1 = __importDefault(require("./functions"));
const keys_1 = __importDefault(require("./keys"));
const number_1 = __importDefault(require("./number"));
const string_1 = __importDefault(require("./string"));
const symbol_1 = __importDefault(require("./symbol"));
const de_json_1 = __importDefault(require("../../locales/de.json"));
const de = Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({}, alternatives_1.default), any_1.default), arrays_1.default), binary_1.default), boolean_1.default), date_1.default), functions_1.default), keys_1.default), number_1.default), string_1.default), symbol_1.default), de_json_1.default);
exports.default = de;
//# sourceMappingURL=index.js.map