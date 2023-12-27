'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const { Op, QueryTypes } = require('sequelize');
const config = require('../config/config.json');
const basename = path.basename(__filename);
const db = {};

// Create a new Sequelize instance for database connection
const sequelize = new Sequelize(config.database.dbName, config.database.dbUser, config.database.dbPassword, {
    dialect: 'mysql',
    host: config.database.host,
    logging: false
});

// Authenticate the Sequelize instance
sequelize.authenticate().then(() => {
    console.log("Db Connected");
}).catch((err) => {
    console.log("Db Error", err.message);
});

fs
    .readdirSync(__dirname)
    .filter(file => {
        return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
    })
    .forEach(file => {
        const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
        db[model.name] = model;
    });

Object.keys(db).forEach(modelName => {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
});
db.sequelize = sequelize;
db.Sequelize = Sequelize;
db.Op = Op;
db.QueryTypes = QueryTypes;

module.exports = db;