'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class notifikasiReminder extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  notifikasiReminder.init({
    id_user: DataTypes.INTEGER,
    id_food: DataTypes.INTEGER,
    judul: DataTypes.STRING,
    pesan: DataTypes.TEXT,
    status: DataTypes.STRING,
    waktuKirim: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'notifikasiReminder',
  });
  return notifikasiReminder;
};