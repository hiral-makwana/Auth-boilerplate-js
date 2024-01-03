const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class UserMeta extends Model {
    };
    UserMeta.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        userId: {
            type: DataTypes.INTEGER,
        },
        key: {
            type: DataTypes.STRING,
        },
        value: {
            type: DataTypes.STRING,
        }
    },
        {
            sequelize,
            tableName: "user_meta",
            modelName: 'UserMeta'
        });

    return UserMeta
};