const { Sequelize, Model, DataTypes } = require("sequelize");

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: "mysql"

});

class File extends Model  {}

File.init({

  id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },

  name: { 
  
    type: DataTypes.STRING,
    isNull: false,
    isLowerCase: true,
    len: [4, 40]
    
  },
  
  size: {
  
    type: DataTypes.INTEGER.UNSIGNED,
    isNull: false,
  
  },
  
  MIME: {
  
    type: DataTypes.STRING,
    isNull: false
  
  },
  
  extension: {
  
    type: DataTypes.STRING,
    isNull: false
  
  },

}, { sequelize, modelName: "file" });

module.exports = File;
