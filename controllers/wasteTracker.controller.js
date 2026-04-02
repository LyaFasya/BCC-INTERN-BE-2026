import db from "../models/index.js"
import { Sequelize } from "sequelize"
const { food: foodModel, foodLog: foodLogModel, foodCategory: foodCategoryModel } = db 

export const getCategoryLossSummary = async (request, response) => {
  try {
    const userId = request.user.id
    
    const [categories, expiredFoods, discardedLogs] = await Promise.all([
      foodCategoryModel.findAll({ raw: true }),
      foodModel.findAll({
        where: { userId, status: "expired" }
      }),
      foodLogModel.findAll({
        include: [{ model: foodModel, as: "food", where: { userId } }],
        where: { status: "discarded" }
      })
    ])

    const resultMap = {}
    categories.forEach(cat => {
      resultMap[cat.id] = { 
        category: cat.categoryName || cat.category_name, 
        total_price: 0, 
        total_amount: 0,
        unit_of_weight: null
      }
    })

    expiredFoods.forEach(item => {
      const catId = item.foodCategoryId || item.food_category_id
      if (!catId || !resultMap[catId]) return
      
      const currentWeight = Number(item.currentWeight) || 0
      const pricePerUnit = Number(item.priceOfUnit) || 0
      resultMap[catId].total_price += currentWeight * pricePerUnit
      resultMap[catId].total_amount += currentWeight
      
      if (!resultMap[catId].unit_of_weight) {
        resultMap[catId].unit_of_weight = item.unitOfWeight || item.unit_of_weight
      }
    })

    discardedLogs.forEach(log => {
      const food = log.food
      if (!food) return
      const catId = food.foodCategoryId || food.food_category_id
      if (!catId || !resultMap[catId]) return

      const amount = Number(log.amount) || 0
      const pricePerUnit = Number(food.priceOfUnit) || 0
      resultMap[catId].total_price += amount * pricePerUnit
      resultMap[catId].total_amount += amount

      if (!resultMap[catId].unit_of_weight) {
        resultMap[catId].unit_of_weight = food.unitOfWeight || food.unit_of_weight
      }
    })

    const resultArray = Object.values(resultMap)
    let totalAllPrice = 0
    resultArray.forEach(cat => {
      totalAllPrice += cat.total_price
    })

    const finalResult = resultArray.map(item => {
      const percentage = totalAllPrice > 0 ? (item.total_price / totalAllPrice) * 100 : 0
      return {
        category: item.category,
        total_amount: Number(item.total_amount.toFixed(2)),
        unit_of_weight: item.unit_of_weight || "-",
        total_price: Number(item.total_price.toFixed(2)),
        percentage: Number(percentage.toFixed(2))
      }
    }).sort((a, b) => b.total_price - a.total_price)

    return response.status(200).json({
      success: true,
      message: "Success get category loss summary",
      data: finalResult
    })
  } catch (error) {
    return response.status(500).json({
      success: false,
      message: error.message
    })
  }
}

export const getCategoryLossPerMonth = async (request, response) => {
  try {
    const userId = request.user.id
    
    const [categories, expiredFoods, discardedLogs] = await Promise.all([
      foodCategoryModel.findAll({ raw: true }),
      foodModel.findAll({
        where: { userId, status: "expired" }
      }),
      foodLogModel.findAll({
        include: [{ model: foodModel, as: "food", where: { userId } }],
        where: { status: "discarded" }
      })
    ])

    const categoryDict = {}
    categories.forEach(cat => { categoryDict[cat.id] = cat.categoryName || cat.category_name })
    
    const monthMap = {}

    const addRecord = (month, catId, price, amount, unit) => {
      if (!catId || !categoryDict[catId]) return
      if (!monthMap[month]) {
        monthMap[month] = {}
        categories.forEach(cat => {
          monthMap[month][cat.id] = { total_price: 0, total_amount: 0, unit_of_weight: null }
        })
      }
      monthMap[month][catId].total_price += price
      monthMap[month][catId].total_amount += amount
      if (!monthMap[month][catId].unit_of_weight) {
        monthMap[month][catId].unit_of_weight = unit
      }
    }

    expiredFoods.forEach(item => {
      const timestamp = item.purchaseDate || item.purchase_date || new Date()
      const dateObj = new Date(timestamp)
      // Pastikan valid dates
      const month = !isNaN(dateObj) ? dateObj.toISOString().slice(0, 7) : new Date().toISOString().slice(0, 7)
      
      const currentWeight = Number(item.currentWeight) || 0
      const pricePerUnit = Number(item.priceOfUnit) || 0
      const price = currentWeight * pricePerUnit
      const catId = item.foodCategoryId || item.food_category_id
      
      addRecord(month, catId, price, currentWeight, item.unitOfWeight || item.unit_of_weight)
    })

    discardedLogs.forEach(log => {
      const food = log.food
      if (!food) return
      
      const timestamp = log.createdAt || log.created_at || new Date()
      const dateObj = new Date(timestamp)
      const month = !isNaN(dateObj) ? dateObj.toISOString().slice(0, 7) : new Date().toISOString().slice(0, 7)
      
      const amount = Number(log.amount) || 0
      const pricePerUnit = Number(food.priceOfUnit) || 0
      const price = amount * pricePerUnit
      const catId = food.foodCategoryId || food.food_category_id

      addRecord(month, catId, price, amount, food.unitOfWeight || food.unit_of_weight)
    })

    const finalResult = Object.keys(monthMap).sort().map(month => {
      const catObj = monthMap[month]
      let totalMonthPrice = 0
      Object.values(catObj).forEach(cat => { totalMonthPrice += cat.total_price })
      
      const categoriesWithZero = categories.map(cat => {
        const data = catObj[cat.id]
        const percentage = totalMonthPrice > 0 ? (data.total_price / totalMonthPrice) * 100 : 0
        return {
          category: categoryDict[cat.id],
          total_amount: Number(data.total_amount.toFixed(2)),
          unit_of_weight: data.unit_of_weight || "-",
          total_price: Number(data.total_price.toFixed(2)),
          percentage: Number(percentage.toFixed(2))
        }
      }).sort((a, b) => b.total_price - a.total_price)

      return { month, categories: categoriesWithZero }
    })
    
    return response.status(200).json({
      success: true,
      message: "Success get category loss summary per month",
      data: finalResult
    })
  } catch (error) {
    return response.status(500).json({
      success: false,
      message: error.message
    })
  }
}

export const getEfficiencyScore = async (request, response) => {
  try {
    const userId = request.user.id
    const now = new Date()
    const currentMonth = now.toISOString().slice(0, 7)
    const lastMonthDate = new Date(now)
    lastMonthDate.setMonth(now.getMonth() - 1)

    const lastMonth = lastMonthDate.toISOString().slice(0, 7)
    const baseQuery = (monthStr) => ({
      attributes: [
        [Sequelize.literal("SUM(foodLog.amount * food.price_of_unit)"), "totalPrice"]
      ],
      include: [{ model: foodModel, as: "food", attributes: [], where: { userId } }],
      where: {
        status: "discarded",
        [Sequelize.Op.and]: [
          Sequelize.literal(`DATE_FORMAT(foodLog.created_at, '%Y-%m') = '${monthStr}'`)
        ]
      },
      raw: true
    })

    const [currentData, lastData] = await Promise.all([
      foodLogModel.findAll(baseQuery(currentMonth)),
      foodLogModel.findAll(baseQuery(lastMonth))
    ])

    const current = Number(currentData[0]?.totalPrice || 0)
    const last = Number(lastData[0]?.totalPrice || 0)
    let efficiency = 0
    if (last > 0) {
      efficiency = ((last - current) / last) * 100
    }
    return response.status(200).json({
      success: true,
      message: "Success get efficiency score",
      data: {
        last_month: last,
        current_month: current,
        efficiency_score: Number(efficiency.toFixed(2))
      }
    })

  } catch (error) {
    return response.status(500).json({
      success: false,
      message: error.message
    })
  }
}

export const getDiscardedHistory = async (request, response) => {
  try {
    const userId = request.user.id
    const data = await foodLogModel.findAll({
      attributes: [
        ["created_at", "discarded_date"],
        "amount",
        [Sequelize.literal(`foodLog.amount * food.price_of_unit`),"total_loss"]
      ],
      include: [
        {
          model: foodModel,
          as: "food",
          attributes: ["foodName", "unitOfWeight"],
          where: { userId },
          include: [
            {
              model: foodCategoryModel,
              attributes: ["categoryName"]
            }
          ]
        }
      ],
      where: {
        status: "discarded"
      },
      order: [["created_at", "DESC"]],
      raw: true,
      nest: true
    })

    return response.status(200).json({
      success: true,
      message: "Success get discarded history",
      data: (data || []).map(item => ({
        name: item.food.foodName,
        category: item.food.foodCategory?.categoryName || "Unknown",
        discarded_date: item.discarded_date,
        amount: Number(item.amount),
        unit_of_weight: item.food.unitOfWeight,
        total_loss: Number(item.total_loss || 0)
      }))
    })

  } catch (error) {
    return response.status(500).json({
      success: false,
      message: error.message
    })
  }
}

export default {getCategoryLossSummary,getCategoryLossPerMonth, getEfficiencyScore, getDiscardedHistory}