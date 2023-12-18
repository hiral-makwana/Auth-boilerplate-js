const keyName = 'otp';
const requestType = {
    REGISTER: 'register',
    FORGOT: 'forgot',
};

const config = {
    JWT_SECRET: 'NDUYehasgsqw978e2SHSHWid8u790',
    JWT_EXPIRATION_TIME: '1h',
};
const status = {
    ACTIVE: 'active',
    DEACTIVE: 'deactive',
    DELETED: 'deleted',
};
module.exports = { keyName, requestType, config, status };
