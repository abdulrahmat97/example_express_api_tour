'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');

const basename = path.basename(module.filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.js')[env];
const db = {};

let sequelize;
const Config = {
  ...config,
  omitNull: true,
  pool: {
    max: 5,
    idle: 30000,
    acquire: 60000,
  },
  define: {
    // this underscored will allow auto transform underscore name to camelCase
    // so updatedAt will become updated_at
    underscored: true,

    // this freezeTableName allow us to ignore plural names
    // and have consistent model name and database name
    // database table name: Product model name: Product
    freezeTableName: true,

    // Set utf8 as default collation
    charset: 'utf8',
    dialectOptions: {
      collate: 'utf8_general_ci',
    },
  },
  isolationLevel: Sequelize.Transaction.ISOLATION_LEVELS.REPEATABLE_READ,
}
if (Config.use_env_variable) {
  sequelize = new Sequelize(process.env[Config.use_env_variable], Config);
} else {
  sequelize = new Sequelize(Config.database, Config.username, Config.password, Config);
}

fs
  .readdirSync(__dirname)
  .filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach(file => {
    const model = sequelize.import(path.join(__dirname, file))
    db[model.name] = model;
  });
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});
db.sequelize = sequelize;
db.Sequelize = Sequelize;
db.Op = Sequelize.Op

module.exports = db;
