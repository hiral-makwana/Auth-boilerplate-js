import { Request, Response, NextFunction } from 'express-serve-static-core';
declare const _default: {
    registerUser: (customFields?: Object, validate?: Boolean) => (req: Request<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>, res: Response<any, Record<string, any>, number>, next: NextFunction) => Promise<void>;
    verifyOTP: () => (req: Request<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>, res: Response<any, Record<string, any>, number>, next: NextFunction) => Promise<void>;
    resendOTP: () => (req: Request<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>, res: Response<any, Record<string, any>, number>, next: NextFunction) => Promise<void>;
    forgotPw: () => (req: Request<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>, res: Response<any, Record<string, any>, number>, next: NextFunction) => Promise<void>;
    resetPw: () => (req: Request<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>, res: Response<any, Record<string, any>, number>, next: NextFunction) => Promise<void>;
    login: () => (req: Request<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>, res: Response<any, Record<string, any>, number>, next: NextFunction) => Promise<void>;
    changePw: () => (req: Request<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>, res: Response<any, Record<string, any>, number>, next: NextFunction) => Promise<void>;
    checkValid: () => (req: Request<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>, res: Response<any, Record<string, any>, number>, next: NextFunction) => Promise<void>;
    emailConfig: () => (req: Request<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>, res: Response<any, Record<string, any>, number>, next: NextFunction) => Promise<void>;
};
export default _default;
