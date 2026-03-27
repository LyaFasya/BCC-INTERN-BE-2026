import { Model } from "sequelize";

export default (sequelize, DataTypes) => {
  class userProfile extends Model {
    static associate(models) {
      userProfile.belongsTo(models.user, {
        foreignKey: 'userId',
        onDelete: 'CASCADE'
      });
    }
  }
  userProfile.init({
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
    profilePublicId: {
      type: DataTypes.STRING,
      field: "profile_public_id"
    },
    name: DataTypes.STRING,
    phoneNumber: {
      type: DataTypes.STRING,
      field: "phone_number"
    },
    address: DataTypes.TEXT,
    profilePicture: {
      type: DataTypes.STRING,
      field: "profile_picture"
    },
    gender: DataTypes.ENUM('male', 'female')
  }, {
    sequelize,
    modelName: 'userProfile',
    tableName: 'user_profiles',
    underscored: true
  });
  return userProfile;
};