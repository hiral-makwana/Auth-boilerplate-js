import User from "../models/user.model";
interface dynamicFields {
    controller?: any | undefined;
    validator?: Object | undefined;
}
export interface RoutesInterface {
    customErrors?: {
        [key: string]: string;
    };
    validator?: Boolean | undefined;
    registerUser?: dynamicFields | undefined;
}
export declare namespace UserLib {
    const Users: typeof User;
}
export {};