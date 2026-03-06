'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('food', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      id_user: {
        type: Sequelize.INTEGER
      },
      id_kategori: {
        type: Sequelize.INTEGER
      },
      nama: {
        type: Sequelize.STRING
      },
      berat: {
        type: Sequelize.DECIMAL
      },
      harga: {
        type: Sequelize.DECIMAL
      },
      location: {
        type: Sequelize.STRING
      },
      status: {
        type: Sequelize.ENUM('tersedia','hampir_kadaluarsa','kadaluarsa','terbuang','habis')
      },
      tanggalBeli: {
        type: Sequelize.DATE
      },
      tanggalKadaluarsa: {
        type: Sequelize.DATE
      },
      tanggalBuang: {
        type: Sequelize.DATE
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('food');
  }
};