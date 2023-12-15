import { Model } from 'sequelize';
interface userMetaInterface {
    id?: number;
    userId?: number;
    key?: string;
    value?: string;
    createdBy?: number;
    updatedBy?: number;
}
declare class UserMeta extends Model<userMetaInterface> implements UserMeta {
    id: number;
    userId: number;
    key: string;
    value: string;
    createdBy: number;
    updatedBy: number;
}
export declare const initUserMeta: (sequelize: any) => void;
export default UserMeta;
