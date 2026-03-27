export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('food_categories', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      category_public_id: {
        type: Sequelize.STRING
      },
      category_name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      category_profile: {
        type: Sequelize.STRING
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
    await queryInterface.dropTable('food_categories');
  }
};