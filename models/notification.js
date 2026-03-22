import { Model } from "sequelize";

export default (sequelize, DataTypes) => {
  class notification extends Model {
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
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    userId: {
      type: DataTypes.INTEGER,
      field: "user_id"
    },
    foodId: {
      type: DataTypes.INTEGER,
      field: "food_id"
    },
    title: DataTypes.STRING,
    message: DataTypes.TEXT,
    type: DataTypes.STRING,
    isRead: {
      type: DataTypes.BOOLEAN,
      field: "is_read"
    }
  }, {
    sequelize,
    modelName: 'notification',
    tableName: 'notifications',
    underscored: true
  });
  return notification;
};