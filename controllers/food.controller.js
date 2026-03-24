import db from "../models/index.js"
import { predictionFood } from "../services/gemini.service.js"
import { Sequelize } from "sequelize"
const foodModel = db.food;

const createFood = async (request, response) => {
  try {
    const userId = request.user.id;
    const {food_category_id, food_name, initial_weight, unit_of_weight, storage_location, purchase_date, price } = request.body;

    if (!food_name || !initial_weight || !unit_of_weight || !storage_location || !purchase_date) {
      return response.status(400).json({
        success: false,
        message: "All required fields must be filled"
      });
    }

    const aiPrediction = await predictionFood({
      food_name,
      storage_location,
      purchase_date,
      initial_weight,
      unit_of_weight
    });

    let expiryDate = null;
    if (aiPrediction.expiry_date) {
      expiryDate = new Date(aiPrediction.expiry_date);
      if (isNaN(expiryDate.getTime())) {
        expiryDate = null;
      }
    }

    if (!expiryDate) {
      const purchase = new Date(purchase_date);
      expiryDate = new Date(purchase);
      expiryDate.setDate(purchase.getDate() + (aiPrediction.shelf_life_days || 3));
    }

    let priceOfUnit = null;
    if (price && initial_weight && initial_weight !== 0) {
      priceOfUnit = price / initial_weight;
    }

    const today = new Date();
    let status = "fresh";
    const diffDays = Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24));

    if (diffDays <= 0) {
      status = "expired";
    } else if (diffDays <= 3) {
      status = "warning";
    }

    const newFood = await foodModel.create({
      userId: userId,
      foodCategoryId: food_category_id,
      foodName: food_name,
      initialWeight: initial_weight,
      currentWeight: initial_weight,
      unitOfWeight: unit_of_weight,
      storageLocation: storage_location,
      purchaseDate: purchase_date,
      expiryDate: expiryDate,
      price: price,
      priceOfUnit: priceOfUnit,
      status: status
    });

    return response.status(201).json({
      success: true,
      message: "Food created successfully",
      data: newFood
    });

  } catch (error) {
    return response.status(500).json({
      success: false,
      message: error.message
    });
  }
}

const getAllFood = async (request, response) => {
  try {
    const userId = request.user.id;
    const foods = await foodModel.findAll({
      where: { userId },
      order: [
        [
          Sequelize.literal(`
            CASE 
              WHEN status = 'fresh' THEN 1
              WHEN status = 'warning' THEN 2
              WHEN status = 'expired' THEN 3
              ELSE 4
            END
          `),
          "ASC"
        ],
        ["expiryDate", "ASC"]
      ]
    });

    return response.status(200).json({
      success: true,
      message: "Success get all foods (sorted by status)",
      data: foods
    });

  } catch (error) {
    return response.status(500).json({
      success: false,
      message: error.message
    });
  }
}

const updateFoodUsage = async (request, response) => {
  try {
    const userId = request.user.id;
    const foodId = request.params.id;
    const { used_weight } = request.body;

    if (!used_weight || used_weight <= 0) {
      return response.status(400).json({
        success: false,
        message: "used_weight must be greater than 0"
      });
    }

    const food = await foodModel.findOne({
      where: {
        id: foodId,
        userId: userId
      }
    });

    if (!food) {
      return response.status(404).json({
        success: false,
        message: "Food not found"
      });
    }

    if (used_weight > food.currentWeight) {
      return response.status(400).json({
        success: false,
        message: "Used weight exceeds current stock"
      });
    }

    const newCurrentWeight = food.currentWeight - used_weight;

    await food.update({
      currentWeight: newCurrentWeight
    });

    return response.status(200).json({
      success: true,
      message: "Food usage updated successfully",
      data: food
    });

  } catch (error) {
    return response.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const getFreshCount = async (request, response) => {
  try {
    if (!request.user) {
      return response.status(401).json({
        success: false,
        message: "Unauthorized"
      });
    }

    const userId = request.user.id;

    const count = await foodModel.count({
      where: {
        status: "fresh",
        userId: userId
      }
    });

    return response.status(200).json({
      success: true,
      message: "Total number of fresh food items",
      data: count
    });

  } catch (error) {
    return response.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const getConsumedCount = async (request, response) => {
  try {
    if (!request.user) {
      return response.status(401).json({
        success: false,
        message: "Unauthorized"
      });
    }

    const { id: userId } = request.user
    const count = await food.count({
      where: {
        userId,
        status: "consumed"
      }
    });

    return response.status(200).json({
      success: true,
      message: "Total number of consumed food items",
      data: count
    });
  } catch (error) {
    return response.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const getWarningCount = async (request, response) => {
  try {
    if (!request.user) {
      return response.status(401).json({
        success: false,
        message: "Unauthorized"
      });
    }

    const userId = request.user.id;
    const count = await food.count({
      where: {
        status: "warning",
        userId: userId
      }
    });

    return response.status(200).json({
      success: true,
      message: "Total number of warning food items",
      data: count
    });
  } catch (error) {
    return response.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const getExpiredCount= async (request, response) => {
  try {
    if (!request.user) {
      return response.status(401).json({
        success: false,
        message: "Unauthorized"
      });
    }

    const userId = request.user.id;
    const count = await food.count({
      where: {
        status: "expired",
        userId: userId
      }
    });

    return response.status(200).json({
      success: true,
      message: "Total number of expired food items",
      data: count
    });
  } catch (error) {
    return response.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const getLossFromDiscarded = async (request, response) => {
  try {
    const userId = request.user.id;

    const result = await food.findOne({
      attributes: [
        [
          Sequelize.fn(
            "SUM",
            Sequelize.literal("price_of_unit * current_weight")
          ),
          "totalLoss"
        ]
      ],
      where: {
        status: "discarded",
        userId: userId
      },
      raw: true
    });

    return response.status(200).json({
      success: true,
      message: "Total financial loss from discarded food",
      data: result.totalLoss || 0
    })
  } catch (error) {
    return response.status(500).json({
      success: false,
      message: error.message
    })
  }
}

const getPriceWarning = async (request, response) => {
  try {
    const userId = request.user.id;

    const result = await food.findOne({
      attributes: [
        [
          Sequelize.literal("COALESCE(SUM(price_of_unit * current_weight), 0)"),
          "totalValue"
        ]
      ],
      where: {
        status: "warning",
        userId: userId
      },
      raw: true
    });

    return response.status(200).json({
      success: true,
      message: "Total value of warning food items for this user",
      data: result.totalValue
    });
  } catch (error) {
    return response.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export default {createFood, getAllFood, updateFoodUsage,getFreshCount, getConsumedCount, getWarningCount, getExpiredCount, getLossFromDiscarded, getPriceWarning}