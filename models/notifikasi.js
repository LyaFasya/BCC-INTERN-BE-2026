'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class notifikasi extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  notifikasi.init({
    id_user: DataTypes.INTEGER,
    judul: DataTypes.STRING,
    pesan: DataTypes.TEXT,
    tipe: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'notifikasi',
  });
  return notifikasi;
};