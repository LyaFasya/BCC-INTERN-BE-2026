import { Model } from "sequelize";

export default (sequelize, DataTypes) => {
  class foodLog extends Model {
    static associate(models) {
      foodLog.belongsTo(models.food, {
        foreignKey: "foodId"
      });
    }
  }

  foodLog.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      foodId: {
        type: DataTypes.INTEGER,
        field: "food_id"
      },
      userId: {
        type: DataTypes.INTEGER,
        field: "user_id"
      },
      amount: {
        type: DataTypes.FLOAT
      },
      status: {
        type: DataTypes.ENUM("consumed", "discarded")
      }
    },
    {
      sequelize,
      modelName: "foodLog",
      tableName: "food_logs",
      underscored: true
    }
  );

  return foodLog;
};