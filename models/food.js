'use strict';
const { 
  Model 
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class food extends Model {
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
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "user_id"
    },
    foodCategoryId: {
      type: DataTypes.INTEGER,
      field: "food_category_id"
    },
    foodName: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "food_name"
    },
    initialWeight: {
      type: DataTypes.FLOAT,
      allowNull: false,
      field: "initial_weight"
    },
    currentWeight: {
      type: DataTypes.FLOAT,
      allowNull: false,
      field: "current_weight"
    },
    unitOfWeight: {
      type: DataTypes.ENUM(
        'kg',
        'gr',
        'butir',
        'ikat',
        'buah',
        'siung',
        'ruas',
        'liter',
        'ml'
      ),
      allowNull: false,
      field: "unit_of_weight"
    },
    storageLocation: {
      type: DataTypes.ENUM(
        'freezer',
        'refrigerator',
        'room_temperature'
      ),
      allowNull: false,
      field: "storage_location"
    },
    purchaseDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      field: "purchase_date"
    },
    expiryDate: {
      type: DataTypes.DATEONLY,
      field: "expiry_date"
    },
    price: {
      type: DataTypes.DECIMAL
    },
    priceOfUnit: {
      type: DataTypes.DECIMAL,
      field: "price_of_unit"
    },
    status: {
      type: DataTypes.ENUM('fresh','warning','expired','wasted'),
      defaultValue: 'fresh'
    }
  }, {
    sequelize,
    modelName: 'food',
    tableName: 'foods',
    underscored: true
  });
  return food;
};