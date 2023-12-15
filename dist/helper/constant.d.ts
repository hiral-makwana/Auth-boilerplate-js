declare const keyName = "otp";
declare const requestType: {
    REGISTER: string;
    FORGOT: string;
};
declare const config: {
    JWT_SECRET: string;
    JWT_EXIPIRATION_TIME: string;
};
export { keyName, requestType, config };
