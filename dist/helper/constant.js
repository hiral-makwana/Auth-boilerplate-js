"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = exports.requestType = exports.keyName = void 0;
const keyName = 'otp';
exports.keyName = keyName;
const requestType = {
    REGISTER: 'register',
    FORGOT: 'forgot'
};
exports.requestType = requestType;
const config = {
    JWT_SECRET: 'NDUYehasgsqw978e2SHSHWid8u790',
    JWT_EXIPIRATION_TIME: '1h'
};
exports.config = config;
//# sourceMappingURL=constant.js.map