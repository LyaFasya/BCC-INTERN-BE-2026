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
      // define association here
    }
  }
  food.init({
    id_User: DataTypes.INTEGER,
    id_kategori: DataTypes.INTEGER,
    nama: DataTypes.STRING,
    berat: DataTypes.DECIMAL,
    harga: DataTypes.DECIMAL,
    location: DataTypes.STRING,
    tanggalBeli: DataTypes.DATE,
    tanggalKadaluarsa: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'food',
  });
  return food;
};