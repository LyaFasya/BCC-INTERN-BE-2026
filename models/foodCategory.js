'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class foodCategory extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
       foodCategory.hasMany(models.food, {
        foreignKey: 'foodCategoryId'
      });
    }
  }
  foodCategory.init({
    id:{
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    categoryName: DataTypes.STRING,
    categoryProfile: DataTypes.STRING,
    description: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'foodCategory',
    tableName: 'food_categories'
  });
  return foodCategory;
};