export const thisIsAModule = true;

declare global {
    var config: any;
    var sequelize: any;
    var customFields: any;
    namespace Express {
        interface Request {
            token: string,
            user: any
        }
    }
}