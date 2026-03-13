'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class userProfile extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      userProfile.belongsTo(models.user, {
        foreignKey: 'userId'
      });
    }
  }
  userProfile.init({
    id:{
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    userId: DataTypes.INTEGER,
    name: DataTypes.STRING,
    phoneNumber: DataTypes.STRING,
    address: DataTypes.TEXT,
    profilePicture: DataTypes.STRING,
    gender: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'userProfile',
    tableName: 'user_profiles'
  });
  return userProfile;
};