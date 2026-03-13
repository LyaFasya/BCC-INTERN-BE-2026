'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('foods', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "users",
          key: "id"
        }
      },
      foodCategoryId: {
        type: Sequelize.INTEGER,
        references: {
          model: "food_categories",
          key: "id"
        }
      },
      foodName: {
        type: Sequelize.STRING,
        allowNull: false
      },
      initialWeight: {
        type: Sequelize.FLOAT,
        allowNull: false
      },
      currentWeight: {
        type: Sequelize.FLOAT,
        allowNull: false
      },
      unitOfWeight: {
        type: Sequelize.STRING,
        allowNull: false
      },
      storageLocation: {
        type: Sequelize.STRING,
        allowNull: false
      },
      purchaseDate: {
        type: Sequelize.DATE,
        allowNull: false
      },
      expiryDate: {
        type: Sequelize.DATE
      },
      price: {
        type: Sequelize.DECIMAL
      },
      priceOfUnit: {
        type: Sequelize.DECIMAL
      },
      status: {
        type: Sequelize.ENUM(
          'fresh',
          'warning',
          'expired',
          'wasted'
        ),
        defaultValue: 'fresh'
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('foods');
  }
};