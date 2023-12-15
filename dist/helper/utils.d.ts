import { Sequelize } from 'sequelize';
import { UserLib } from "./interfaces";
export declare function setSequelizeInstance(instance: Sequelize): void;
declare const getModels: () => typeof UserLib;
declare const dynamicFieldFunction: (customFields?: Object, validate?: Boolean) => {
    [x: string]: any;
}[];
declare const generateRandomOtp: (n: any) => Promise<number>;
declare const generateHash: (password: any) => Promise<string>;
declare const generateOtpHtmlMessage: (to: any, custom: any, template: any, emailSubject: any, templateData: any) => Promise<unknown>;
declare function convertHtmlToString(html: any): {
    status: boolean;
    message: string;
    result: string;
} | {
    status: boolean;
    message: any;
    result?: undefined;
};
declare function updateConfigFromJson(filePath: any): void;
export { getModels, dynamicFieldFunction, generateRandomOtp, generateHash, generateOtpHtmlMessage, convertHtmlToString, updateConfigFromJson };
