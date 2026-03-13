'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class notification extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      notification.belongsTo(models.user, {
        foreignKey: 'userId'
      });
      notification.belongsTo(models.food, {
        foreignKey: 'foodId'
      });
    }
  }
  notification.init({
    id:{
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    userId: DataTypes.INTEGER,
    foodId: DataTypes.INTEGER,
    title: DataTypes.STRING,
    message: DataTypes.TEXT,
    type: DataTypes.STRING,
    isRead: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'notification',
    tableName: 'notifications'
  });
  return notification;
};