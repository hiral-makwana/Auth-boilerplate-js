import { Model } from 'sequelize';
/** User enum  for status*/
export declare enum status {
    ACTIVE = "active",
    DEACTIVE = "deactive",
    DELETED = "deleted"
}
declare class User extends Model implements User {
}
export declare const initUser: any;
export default User;
