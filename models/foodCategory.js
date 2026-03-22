import { Model } from "sequelize";

export default (sequelize, DataTypes) => {
  class foodCategory extends Model {
    static associate(models) {
       foodCategory.hasMany(models.food, {
        foreignKey: 'foodCategoryId'
      });
    }
  }
  foodCategory.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    categoryName: {
      type: DataTypes.STRING,
      field: "category_name"
    },
    categoryProfile: {
      type: DataTypes.STRING,
      field: "category_profile"
    },
    description: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'foodCategory',
    tableName: 'food_categories',
    underscored: true
  });
  return foodCategory;
};