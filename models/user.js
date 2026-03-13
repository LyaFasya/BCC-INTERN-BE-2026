'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class user extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      user.hasOne(models.userProfile, {
        foreignKey: 'userId'
      });
      user.hasMany(models.food, {
        foreignKey: 'userId'
      });
      user.hasMany(models.notification, {
        foreignKey: 'userId'
      });
    }
  }
  user.init({
    id:{
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    role: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'user',
    tableName: 'users'
  });
  return user;
};