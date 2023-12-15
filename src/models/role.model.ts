import { Model, DataTypes } from 'sequelize';

interface roleInterface {
  id?: number,
  roleName?: string,
  createdBy?: number,
  updatedBy?: number
}

let keys = {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  roleName: {
    type: DataTypes.STRING
  },
  createdBy: {
    type: DataTypes.INTEGER
  },
  updatedBy: {
    type: DataTypes.INTEGER
  }
}

class Role extends Model<roleInterface>
  implements Role {
  id!: number
  roleName!: string
  createdBy!: number
  updatedBy!: number
}

export const initRole = (sequelize) => {
  Role.init(keys, {
    sequelize: sequelize,
    tableName: 'roles',
    modelName: 'role',
  });

  // Synchronize the model with the database
  sequelize.sync()
    .then(() => {
      return Role.findAndCountAll();
    })
    .then(({ count }) => {
      if (count === 0) {
        return Role.bulkCreate([
          { id: 1, roleName: 'Admin', createdBy: null, updatedBy: null },
          { id: 2, roleName: 'User', createdBy: null, updatedBy: null }
        ]);
      }
    })
    .then(() => {
      console.log('Default data inserted into the roles table');
    })
    .catch((e: any) => {
      throw new Error(e);
    });
};
