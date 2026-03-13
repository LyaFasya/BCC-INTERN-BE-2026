'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class food extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      food.belongsTo(models.user, {
        foreignKey: 'userId'
      });
      food.belongsTo(models.foodCategory, {
        foreignKey: 'foodCategoryId'
      });
      food.hasMany(models.notification, {
        foreignKey: 'foodId'
      });
    }
  }
  food.init({
    id:{
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    userId: DataTypes.INTEGER,
    foodName: DataTypes.STRING,
    foodCategoryId: DataTypes.INTEGER,
    initialWeight: DataTypes.FLOAT,
    currentWeight: DataTypes.FLOAT,
    unitOfWeight: DataTypes.STRING,
    storageLocation: DataTypes.STRING,
    purchaseDate: DataTypes.DATEONLY,
    expiryDate: DataTypes.DATEONLY,
    price: DataTypes.DECIMAL,
    priceOfUnit: DataTypes.DECIMAL,
    status: DataTypes.ENUM('fresh','warning','expired','wasted')
  }, {
    sequelize,
    modelName: 'food',
    tableName: 'foods'
  });
  return food;
};