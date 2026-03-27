import db from "../models/index.js"
import { predictionFood } from "../services/gemini.service.js"
import { Sequelize, Op } from "sequelize"
const { food: foodModel, foodLog: foodLogModel } = db 

const createFood = async (request, response) => {
  try {
    const userId = request.user.id 
    let {food_category_id, food_name, initial_weight, unit_of_weight, storage_location, purchase_date, price} = request.body 
    if (!food_name || !initial_weight || !unit_of_weight || !storage_location || !purchase_date) {
      return response.status(400).json({
        success: false,
        message: "All required fields must be filled"
      }) 
    }

    const today = new Date() 
    const inputDate = new Date(purchase_date) 
    today.setHours(0, 0, 0, 0) 
    inputDate.setHours(0, 0, 0, 0) 
    if (inputDate > today) {
      return response.status(400).json({
        success: false,
        message: "Purchase date cannot be in the future"
      }) 
    }

    food_name = food_name.trim() 
    initial_weight = Number(initial_weight) 
    price = price ? Number(price) : null 
    if (isNaN(initial_weight) || initial_weight <= 0) {
      return response.status(400).json({
        success: false,
        message: "Invalid initial weight"
      }) 
    }

    const aiPrediction = await predictionFood({
      food_name,
      storage_location,
      purchase_date,
      initial_weight,
      unit_of_weight
    }) 

    let expiryDate = null 
    if (aiPrediction.expiry_date) {
      expiryDate = new Date(aiPrediction.expiry_date) 
      if (isNaN(expiryDate.getTime())) {
        expiryDate = null 
      }
    }
    if (!expiryDate) {
      const purchase = new Date(purchase_date) 
      expiryDate = new Date(purchase) 
      expiryDate.setDate(purchase.getDate() + (aiPrediction.shelf_life_days || 3)) 
    }

    let priceOfUnit = null 
    if (price && initial_weight !== 0) {
      priceOfUnit = Number((price / initial_weight).toFixed(2)) 
    }

    let status = "fresh" 
    const diffDays = Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24)) 
    if (diffDays <= 0) {
      status = "expired" 
    } else if (diffDays <= 3) {
      status = "warning" 
    }

    const newFood = await foodModel.create({
      userId,
      foodCategoryId: food_category_id,
      foodName: food_name,
      initialWeight: initial_weight,
      currentWeight: initial_weight,
      unitOfWeight: unit_of_weight,
      storageLocation: storage_location,
      purchaseDate: purchase_date,
      expiryDate,
      price,
      priceOfUnit,
      status
    }) 

    return response.status(201).json({
      success: true,
      message: "Food created successfully",
      data: newFood
    }) 

  } catch (error) {
    return response.status(500).json({
      success: false,
      message: error.message
    }) 
  }
} 

const getAllFood = async (request, response) => {
  try {
    const userId = request.user.id 
    const food = await foodModel.findAll({
      where: { userId }
    }) 

    const today = new Date() 
    const result = food.map((food) => {
      const expiryDate = new Date(food.expiryDate) 
      const purchaseDate = new Date(food.purchaseDate) 

      const diffTime = expiryDate - today 
      let daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) 
      if (daysLeft <= 0) daysLeft = 0 
      
      const currentWeight = Number(food.currentWeight) || 0 
      const pricePerUnit = Number(food.priceOfUnit) || 0 
      const totalPrice = currentWeight * pricePerUnit 
      const safeDays = daysLeft === 0 ? 1 : daysLeft 
      const riskScore = totalPrice / safeDays 
      return {
        id: food.id,
        food_category_id: food.foodCategoryId, 
        name: food.foodName,
        current_weight: currentWeight,
        unit_weight: food.unitOfWeight,
        purchase_date: purchaseDate,
        expiry_date: expiryDate,
        days_left: daysLeft,
        total_price: totalPrice,
        storage_location: food.storageLocation,
        risk_score: Number(riskScore.toFixed(2))
      } 
    }) 

    return response.status(200).json({
      success: true,
      message: "Success get all food",
      data: result
    }) 

  } catch (error) {
    return response.status(500).json({
      success: false,
      message: error.message
    }) 
  }
} 

const getDetailFood = async (request, response) => {
  try {
    const userId = request.user.id 
    const foodId = request.params.id 
    const food = await foodModel.findOne({
      where: {
        id: foodId,
        userId: userId
      }
    }) 
    if (!food) {
      return response.status(404).json({
        success: false,
        message: "Food not found"
      }) 
    }
    return response.status(200).json({
      success: true,
      message: "Success get food detail",
      data: food
    }) 
  } catch (error) {
    return response.status(500).json({
      success: false,
      message: error.message
    }) 
  }
} 

const updateFoodUsage = async (request, response) => {
  const t = await db.sequelize.transaction()
  try {
    const userId = request.user.id 
    const foodId = request.params.id 
    let { used_weight } = request.body 
    used_weight = Number(used_weight) 
    if (!used_weight || used_weight <= 0) {
      return response.status(400).json({
        success: false,
        message: "used_weight must be greater than 0"
      }) 
    }

    const food = await foodModel.findOne({
      where: {
        id: foodId,
        userId: userId
      },
      transaction: t
    }) 
    if (!food) {
      await t.rollback() 
      return response.status(404).json({
        success: false,
        message: "Food not found"
      }) 
    }

    if (used_weight > food.currentWeight) {
      await t.rollback() 
      return response.status(400).json({
        success: false,
        message: `Stock not enough. Available: ${food.currentWeight}`
      }) 
    }
    const newCurrentWeight = food.currentWeight - used_weight 
    let newStatus = newCurrentWeight === 0 ? "consumed" : food.status 
    await foodLogModel.create(
      {
        foodId: food.id,
        amount: used_weight,
        status: "consumed"
      },
      { transaction: t }
    ) 
    await food.update(
      {
        currentWeight: newCurrentWeight,
        status: newStatus
      },
      { transaction: t }
    ) 

    await t.commit() 
    return response.status(200).json({
      success: true,
      message: "Food usage recorded successfully",
      data: {
        food_id: food.id,
        name: food.foodName,
        used_weight: used_weight,
        remaining_weight: newCurrentWeight,
        status: newStatus
      }
    }) 

  } catch (error) {
    await t.rollback() 
    return response.status(500).json({
      success: false,
      message: error.message
    }) 
  }
} 

const discardFood = async (request, response) => {
  const t = await db.sequelize.transaction() 
  try {
    const userId = request.user.id 
    const foodId = request.params.id 
    let { discarded_weight } = request.body 
    discarded_weight = Number(discarded_weight) 
    if (!discarded_weight || discarded_weight <= 0) {
      await t.rollback() 
      return response.status(400).json({
        success: false,
        message: "discarded_weight must be greater than 0"
      }) 
    }

    const food = await foodModel.findOne({
      where: { id: foodId, userId },
      transaction: t
    }) 
    if (!food) {
      await t.rollback() 
      return response.status(404).json({
        success: false,
        message: "Food not found"
      }) 
    }

    const currentStock = Number(food.currentWeight) || 0 
    if (currentStock === 0) {
      await t.rollback() 
      return response.status(400).json({
        success: false,
        message: "Stock is already empty"
      }) 
    }
    if (discarded_weight > currentStock) {
      await t.rollback() 
      return response.status(400).json({
        success: false,
        message: `Stock not enough. Available: ${currentStock}`
      }) 
    }

    const newCurrentWeight = currentStock - discarded_weight 
    const newStatus = newCurrentWeight === 0 ? "consumed" : food.status 
    await foodLogModel.create(
      {
        foodId: food.id,
        amount: discarded_weight,
        status: "discarded"
      },
      { transaction: t }
    ) 
    await food.update(
      {
        currentWeight: newCurrentWeight,
        status: newStatus
      },
      { transaction: t }
    ) 
    await t.commit() 
    return response.status(200).json({
      success: true,
      message: "Food discarded successfully",
      data: {
        food_id: food.id,
        name: food.foodName,
        discarded_weight,
        remaining_weight: newCurrentWeight,
        status: newStatus
      }
    }) 

  } catch (error) {
    await t.rollback() 
    return response.status(500).json({
      success: false,
      message: error.message
    }) 
  }
}

export const getRiskRankingPanel = async (request, response) => {
  try {
    const userId = request.user.id
    const food = await foodModel.findAll({
      attributes: [
        "id",
        "food_name",
        "current_weight",
        "unit_of_weight",
        "price_of_unit",
        [
          Sequelize.literal(`
            GREATEST(DATEDIFF(expiry_date, NOW()), 0)
          `),
          "days_left"
        ],
        [
          Sequelize.literal(`
            (COALESCE(current_weight,0) * COALESCE(price_of_unit,0)) /
            GREATEST(DATEDIFF(expiry_date, NOW()), 1)
          `),
          "risk_score"
        ]
      ],
      where: {
        userId,
        status: {
          [Op.in]: ["fresh", "warning"]
        }
      },
      order: [[Sequelize.literal("risk_score"), "DESC"]],
      raw: true
    })
    if (!food || food.length === 0) {
      return response.status(200).json({
        success: true,
        message: "Success get risk ranking",
        data: []
      })
    }

    const formatted = food.map(item => ({
      food_name: item.food_name,
      current_weight: Number(item.current_weight),
      unit_of_weight: item.unit_of_weight,
      price_of_unit: Number(item.price_of_unit),
      days_left: Number(item.days_left),
      risk_score: Number(Number(item.risk_score || 0).toFixed(2))
    }))

    return response.status(200).json({
      success: true,
      message: "Success get risk ranking",
      data: formatted
    })
  } catch (error) {
    console.error("ERROR RISK RANKING:", error)
    return response.status(500).json({
      success: false,
      message: error.message
    })
  }
}

export default { createFood, getAllFood, getDetailFood, updateFoodUsage, discardFood, getRiskRankingPanel}