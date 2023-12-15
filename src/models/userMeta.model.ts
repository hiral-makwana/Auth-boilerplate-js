import { Model, DataTypes } from 'sequelize';

interface userMetaInterface {
    id?: number,
    userId?: number,
    key?: string,
    value?: string,
    createdBy?: number,
    updatedBy?: number
}

let keys = {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    userId: {
        type: DataTypes.INTEGER
    },
    key: {
        type: DataTypes.STRING
    },
    value: {
        type: DataTypes.STRING
    },
    createdBy: {
        type: DataTypes.INTEGER
    },
    updatedBy: {
        type: DataTypes.INTEGER
    },
}

class UserMeta extends Model<userMetaInterface>
    implements UserMeta {
    id!: number
    userId!: number
    key!: string
    value!: string
    createdBy!: number
    updatedBy!: number
}

export const initUserMeta = (sequelize) => {
    UserMeta.init(keys, {
        sequelize: sequelize,
        tableName: 'user_meta',
        modelName: 'userMeta',
    }).sync({ alter: true }).then((r: any) => {
        console.log("Sync true", r);
    }).catch((e: any) => { throw new Error(e); });
}

export default UserMeta
