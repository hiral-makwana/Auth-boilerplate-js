"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const i18n_1 = __importDefault(require("i18n"));
const path_1 = __importDefault(require("path"));
//const i18n = new I18n()
i18n_1.default.configure({
    locales: ['en', 'de', 'fr'],
    directory: path_1.default.join(__dirname, '../locales'),
    messageDirectories: {
        'en': path_1.default.join(__dirname, '../messages/en'),
        'de': path_1.default.join(__dirname, '../messages/de'),
        'fr': path_1.default.join(__dirname, '../messages/fr')
    },
    header: 'accept-language',
    register: global
});
exports.default = i18n_1.default;
//# sourceMappingURL=i18n.js.map