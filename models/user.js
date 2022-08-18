const { Sequelize, Model, DataTypes } = require("sequelize"),
  passportLocalSequelize = require("passport-local-sequelize");

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: "mysql"

});

class User extends Model  {}

User.init({

  id: {
  
    type: DataTypes.STRING,
    primaryKey: true,
    isNull: false
    
  },
  
  refreshAvailabale: {
  
    type: DataTypes.BOOLEAN,
    defaultValue: false
  
  },
  
  hash: DataTypes.TEXT,
  salt: DataTypes.TEXT,
  
}, { sequelize, modelName: "user" });

passportLocalSequelize.attachToUser(User, {

    usernameField: "id",
    hashField: "hash",
    saltField: "salt"
    
});

module.exports = User;
