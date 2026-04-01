import db from "../models/index.js"
import { Sequelize } from "sequelize"
const { food: foodModel, foodLog: foodLogModel, foodCategory: foodCategoryModel } = db 

export const getCategoryLossSummary = async (request, response) => {
  try {
    const userId = request.user.id
    const [categories, expiredData, discardedData] = await Promise.all([
      foodCategoryModel.findAll({
        attributes: ["id", "category_name"],
        raw: true
      }),
      foodModel.findAll({
        attributes: [
          "id",
          [Sequelize.literal("SUM(current_weight * price_of_unit)"), "totalPrice"]
        ],
        where: { userId, status: "expired" },
        group: ["id"],
        raw: true
      }),
      foodLogModel.findAll({
        attributes: [
          [Sequelize.col("food.id"), "id"],
          [Sequelize.literal("SUM(foodLog.amount * food.price_of_unit)"), "totalPrice"]
        ],
        include: [{ model: foodModel, as: "food", attributes: [], where: { userId } }],
        where: { status: "discarded" },
        group: ["food.id"],
        raw: true
      })
    ])
    const resultMap = {}
    categories.forEach(cat => {
      resultMap[cat.id] = { category: cat.category_name, total_price: 0 }
    })

    const addPrice = (dataArr) => {
      dataArr.forEach(item => {
        if (resultMap[item.id]) {
          resultMap[item.id].total_price += Number(item.totalPrice || 0)
        }
      })
    }

    addPrice(expiredData)
    addPrice(discardedData)

    const resultArray = Object.values(resultMap)
    const totalAllPrice = resultArray.reduce((sum, item) => sum + item.total_price, 0)

    const finalResult = resultArray.map(item => {
      const percentage = totalAllPrice > 0 ? (item.total_price / totalAllPrice) * 100 : 0
      return {
        category: item.category,
        total_price: item.total_price,
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
    const [categories, expiredData, discardedData] = await Promise.all([
      foodCategoryModel.findAll({
        attributes: ["id", "category_name"],
        raw: true
      }),
      foodModel.findAll({
        attributes: [
          [Sequelize.literal("DATE_FORMAT(purchase_date, '%Y-%m')"), "month"],
          "id",
          [Sequelize.literal("SUM(current_weight * price_of_unit)"), "totalPrice"]
        ],
        where: { userId, status: "expired" },
        group: [Sequelize.literal("DATE_FORMAT(purchase_date, '%Y-%m')"), "id"],
        raw: true
      }),
      foodLogModel.findAll({
        attributes: [
          [Sequelize.literal("DATE_FORMAT(foodLog.created_at, '%Y-%m')"), "month"],
          [Sequelize.col("food.id"), "id"],
          [Sequelize.literal("SUM(foodLog.amount * food.price_of_unit)"), "totalPrice"]
        ],
        include: [{ model: foodModel, as: "food", attributes: [], where: { userId } }],
        where: { status: "discarded" },
        group: [Sequelize.literal("DATE_FORMAT(foodLog.created_at, '%Y-%m')"), "food.id"],
        raw: true
      })
    ])

    const categoryDict = {}
    categories.forEach(cat => { categoryDict[cat.id] = cat.category_name })
    
    const resultMap = {}
    const addToMap = (dataArr) => {
      dataArr.forEach(item => {
        const key = `${item.month}-${item.id}`
        if (!resultMap[key]) {
          resultMap[key] = {
            month: item.month,
            id: item.id,
            category: categoryDict[item.id] || "Unknown",
            total_price: 0
          }
        }
        resultMap[key].total_price += Number(item.totalPrice || 0)
      })
    }

    addToMap(expiredData)
    addToMap(discardedData)

    const groupedByMonth = {}
    Object.values(resultMap).forEach(item => {
      if (!groupedByMonth[item.month]) {
        groupedByMonth[item.month] = []
      }
      groupedByMonth[item.month].push(item)
    })

    const finalResult = Object.keys(groupedByMonth).map(month => {
      const items = groupedByMonth[month]
      const totalMonth = items.reduce((sum, item) => sum + item.total_price, 0)

      const categoryMap = {}
      items.forEach(item => { categoryMap[item.id] = item.total_price })

      const categoriesWithZero = categories.map(cat => {
        const total_price = categoryMap[cat.id] || 0
        const percentage = totalMonth > 0 ? (total_price / totalMonth) * 100 : 0
        return {
          category: cat.category_name,
          total_price,
          percentage: Number(percentage.toFixed(2))
        }
      }).sort((a, b) => b.total_price - a.total_price)
      
      return { month, categories: categoriesWithZero }
    }).sort((a, b) => a.month.localeCompare(b.month))
    
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
          where: { userId }
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