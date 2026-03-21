'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('foods', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "users",
          key: "id"
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE"
      },
      food_category_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "food_categories",
          key: "id"
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL"
      },
      food_name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      initial_weight: {
        type: Sequelize.FLOAT,
        allowNull: false
      },
      current_weight: {
        type: Sequelize.FLOAT,
        allowNull: false
      },
      unit_of_weight: {
        type: Sequelize.ENUM(
          'kg',
          'gr',
          'butir',
          'ikat',
          'buah',
          'siung',
          'ruas',
          'liter',
          'ml'
        ),
        allowNull: false
      },
      storage_location: {
        type: Sequelize.ENUM(
          'freezer',
          'refrigerator',
          'room_temperature'
        ),
        allowNull: false
      },
      purchase_date: {
        type: Sequelize.DATE,
        allowNull: false
      },
      expiry_date: {
        type: Sequelize.DATE
      },
      price: {
        type: Sequelize.DECIMAL
      },
      price_of_unit: {
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
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      }
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable('foods');
  }
};