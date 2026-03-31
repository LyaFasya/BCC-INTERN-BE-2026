import { Model } from "sequelize";

export default (sequelize, DataTypes) => {
  class user extends Model {
    static associate(models) {
      user.hasOne(models.userProfile, {
        foreignKey: 'userId',
        onDelete: 'CASCADE',
        hooks: true
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
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    role: {
      type: DataTypes.ENUM('user', 'admin'),
      allowNull: false,
      defaultValue: 'user'
    },
    refreshToken: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: "refresh_token"
    },
    is_verified: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    verification_token: {
      type: DataTypes.TEXT,
      allowNull: true
    },
  }, {
    sequelize,
    modelName: 'user',
    tableName: 'users',
    underscored: true,
    timestamps: true
  });

  return user;
};