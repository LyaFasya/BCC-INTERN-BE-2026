import db from "./models/index.js";
import { Sequelize, Op } from "sequelize";

const { food: foodModel, foodCategory: foodCategoryModel } = db;

async function test() {
  try {
    const stats = await foodModel.findAll({
      attributes: [
        "foodCategoryId",
        [Sequelize.fn("SUM", Sequelize.col("initial_weight")), "total_weight"],
        [Sequelize.fn("SUM", Sequelize.col("price")), "total_price"],
        [Sequelize.fn("COUNT", Sequelize.col("food.id")), "total_items"],
        [Sequelize.fn("MAX", Sequelize.col("unit_of_weight")), "unit_of_weight"]
      ],
      where: {
        status: {
          [Op.in]: ["fresh", "warning"]
        }
      },
      include: [
        {
          model: foodCategoryModel,
          attributes: ["categoryName", "categoryProfile"]
        }
      ],
      group: ["foodCategoryId", "foodCategory.id"],
      raw: true,
      nest: true
    });
    console.log(JSON.stringify(stats, null, 2));
  } catch (error) {
    console.error(error);
  } finally {
    process.exit();
  }
}

test();
