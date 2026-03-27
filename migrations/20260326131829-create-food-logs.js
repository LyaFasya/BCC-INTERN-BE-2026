export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('food_logs', {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    food_id: {
      type: Sequelize.INTEGER,
      references: {
        model: 'foods',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    amount: {
      type: Sequelize.FLOAT,
    },
    status: {
      type: Sequelize.ENUM('consumed', 'discarded'),
    },
    created_at: {
      allowNull: false,
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW,
    },
    updated_at: {
      allowNull: false,
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW
    }
  });
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.dropTable('food_logs');
}