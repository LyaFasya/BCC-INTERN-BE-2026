import db from "../models/index.js"
import { predictionFood } from "../services/gemini.service.js"
import { Sequelize, Op } from "sequelize"
const { food: foodModel, foodLog: foodLogModel, foodCategory: foodCategoryModel } = db

const createFood = async (request, response) => {
  try {
    const userId = request.user.id

    let {
      food_category_id,
      food_name,
      initial_weight,
      unit_of_weight,
      storage_location,
      purchase_date,
      price
    } = request.body

    if (!food_category_id || !food_name || !initial_weight || !unit_of_weight || !storage_location || !purchase_date) {
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

    food_name = food_name.trim().toLowerCase()
    initial_weight = Number(initial_weight)
    price = price ? Number(price) : null

    if (isNaN(initial_weight) || initial_weight <= 0) {
      return response.status(400).json({
        success: false,
        message: "Invalid initial weight"
      })
    }

    const category = await foodCategoryModel.findByPk(food_category_id)

    if (!category) {
      return response.status(404).json({
        success: false,
        message: "Category not found"
      })
    }

    const category_name = category.categoryName

    const aiPrediction = await predictionFood({
      food_name,
      category_name,
      storage_location,
      purchase_date,
      initial_weight,
      unit_of_weight
    })

    if (aiPrediction.error || !aiPrediction) {
      return response.status(400).json({
        success: false,
        message: aiPrediction?.error || "Invalid food input"
      })
    }

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
    if (price) {
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
    console.error(error)
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
    const result = food.map((item) => {
      const expiryDate = new Date(item.expiryDate)
      const purchaseDate = new Date(item.purchaseDate)

      const diffTime = expiryDate - today
      const daysLeft = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)))

      const currentWeight = Number(item.currentWeight) || 0
      const pricePerUnit = Number(item.priceOfUnit) || 0
      const totalPrice = currentWeight * pricePerUnit
      const safeDays = daysLeft || 1
      const riskScore = totalPrice / safeDays

      return {
        id: item.id,
        food_category_id: item.foodCategoryId,
        name: item.foodName,
        current_weight: currentWeight,
        unit_weight: item.unitOfWeight,
        purchase_date: purchaseDate,
        expiry_date: expiryDate,
        days_left: daysLeft,
        total_price: totalPrice,
        storage_location: item.storageLocation,
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
      transaction: t,
      lock: true
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
      transaction: t,
      lock: true
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

const getRiskRankingPanel = async (request, response) => {
  try {
    const userId = request.user.id
    const foodItems = await foodModel.findAll({
      where: {
        userId,
        status: {
          [Op.in]: ["fresh", "warning"]
        }
      },
      include: [
        {
          model: foodCategoryModel,
          attributes: ["id", "categoryName", "categoryProfile"]
        }
      ]
    })

    if (!foodItems || foodItems.length === 0) {
      return response.status(200).json({
        success: true,
        message: "Success get risk ranking",
        data: []
      })
    }

    const today = new Date()
    const categoryMap = {}

    foodItems.forEach(item => {
      const category = item.foodCategory
      if (!category) return

      const categoryId = category.id

      if (!categoryMap[categoryId]) {
        categoryMap[categoryId] = {
          category_id: categoryId,
          category_name: category.categoryName,
          category_profile: category.categoryProfile,
          total_weight: 0,
          unit_of_weight: item.unitOfWeight,
          total_price: 0,
          risk_score: 0
        }
      }

      categoryMap[categoryId].total_weight += Number(item.initialWeight || 0)
      categoryMap[categoryId].total_price += Number(item.price || 0)

      const expiryDate = new Date(item.expiryDate)
      const diffTime = expiryDate - today
      const daysLeft = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)))

      const currentWeight = Number(item.currentWeight) || 0
      const pricePerUnit = Number(item.priceOfUnit) || 0
      const itemTotalPrice = currentWeight * pricePerUnit
      const safeDays = daysLeft || 1
      const itemRiskScore = itemTotalPrice / safeDays

      categoryMap[categoryId].risk_score += itemRiskScore
    })

    const formatted = Object.values(categoryMap)

    formatted.forEach(item => {
      item.risk_score = Number(item.risk_score.toFixed(2))
    })

    formatted.sort((a, b) => b.risk_score - a.risk_score)

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

const deleteFood = async (request, response) => {
  const t = await db.sequelize.transaction()
  try {
    const userId = request.user.id
    const foodId = request.params.id

    const food = await foodModel.findOne({
      where: {
        id: foodId,
        userId: userId
      },
      transaction: t,
      lock: true
    })

    if (!food) {
      await t.rollback()
      return response.status(404).json({
        success: false,
        message: "Food not found"
      })
    }
    await foodLogModel.destroy({
      where: { foodId: food.id },
      transaction: t
    })

    await food.destroy({ transaction: t })

    await t.commit()
    return response.status(200).json({
      success: true,
      message: "Food deleted successfully"
    })
  } catch (error) {
    await t.rollback()
    return response.status(500).json({
      success: false,
      message: error.message
    })
  }
}

export default { createFood, getAllFood, getDetailFood, updateFoodUsage, discardFood, getRiskRankingPanel, deleteFood }