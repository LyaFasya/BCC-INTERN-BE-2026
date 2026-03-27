import db from "../models/index.js"
import { Sequelize } from "sequelize"
const { food: foodModel, foodLog: foodLogModel } = db 

export const getConsumedStatusPerMonth = async (request, response) => {
  try {
    const userId = request.user.id

    // ======================
    // 🔥 1. FOOD LOG (consumed + discarded)
    // ======================
    const logCounts = await foodLogModel.findAll({
      attributes: [
        [
          Sequelize.literal("DATE_FORMAT(foodLog.created_at, '%Y-%m')"),
          "month"
        ],
        [
          Sequelize.fn("COUNT", Sequelize.col("foodLog.id")),
          "logCount"
        ]
      ],
      include: [
        {
          model: foodModel,
          as: "food",
          attributes: [],
          where: { userId }
        }
      ],
      where: {
        status: ["consumed", "discarded"]
      },
      group: [
        Sequelize.literal("DATE_FORMAT(foodLog.created_at, '%Y-%m')")
      ],
      raw: true
    })

    // ======================
    // 🔥 2. FOOD (fresh + warning + expired)
    // ======================
    const foodCounts = await foodModel.findAll({
      attributes: [
        [
          Sequelize.literal("DATE_FORMAT(purchase_date, '%Y-%m')"),
          "month"
        ],
        [
          Sequelize.fn("COUNT", Sequelize.col("id")),
          "foodCount"
        ]
      ],
      where: {
        userId,
        status: ["fresh", "warning", "expired"]
      },
      group: [
        Sequelize.literal("DATE_FORMAT(purchase_date, '%Y-%m')")
      ],
      raw: true
    })

    // ======================
    // 🔥 3. KHUSUS CONSUMED
    // ======================
    const consumedLogs = await foodLogModel.findAll({
      attributes: [
        [
          Sequelize.literal("DATE_FORMAT(foodLog.created_at, '%Y-%m')"),
          "month"
        ],
        [
          Sequelize.fn("COUNT", Sequelize.col("foodLog.id")),
          "consumedCount"
        ],
        [
          Sequelize.literal("SUM(foodLog.amount * food.price_of_unit)"),
          "totalValue"
        ]
      ],
      include: [
        {
          model: foodModel,
          as: "food",
          attributes: [],
          where: { userId }
        }
      ],
      where: {
        status: "consumed"
      },
      group: [
        Sequelize.literal("DATE_FORMAT(foodLog.created_at, '%Y-%m')")
      ],
      raw: true
    })

    // ======================
    // 🔗 4. MERGE
    // ======================
    const result = {}

    // dari foodLog
    logCounts.forEach(item => {
      result[item.month] = {
        month: item.month,
        total_count: Number(item.logCount),
        consumed_count: 0,
        total_price: 0
      }
    })

    // dari food
    foodCounts.forEach(item => {
      if (!result[item.month]) {
        result[item.month] = {
          month: item.month,
          total_count: 0,
          consumed_count: 0,
          total_price: 0
        }
      }

      result[item.month].total_count += Number(item.foodCount)
    })

    // inject consumed
    consumedLogs.forEach(item => {
      if (!result[item.month]) {
        result[item.month] = {
          month: item.month,
          total_count: 0,
          consumed_count: 0,
          total_price: 0
        }
      }

      result[item.month].consumed_count = Number(item.consumedCount)
      result[item.month].total_price = Number(item.totalValue || 0)
    })

    // ======================
    // 🔢 5. FINAL
    // ======================
    const finalResult = Object.values(result).map(item => {
      const percentage =
        item.total_count > 0
          ? (item.consumed_count / item.total_count) * 100
          : 0

      return {
        month: item.month,
        consumed_percentage: Number(percentage.toFixed(2)),
        consumed_count: item.consumed_count,
        total_price: item.total_price
      }
    })

    return response.status(200).json({
      success: true,
      message: "Success get consumed monthly dashboard",
      data: finalResult
    })

  } catch (error) {
    return response.status(500).json({
      success: false,
      message: error.message
    })
  }
}

export const getDiscardedStatusPerMonth = async (request, response) => {
  try {
    const userId = request.user.id

    // ======================
    // 🔥 1. FOOD LOG (consumed + discarded)
    // ======================
    const logCounts = await foodLogModel.findAll({
      attributes: [
        [
          Sequelize.literal("DATE_FORMAT(foodLog.created_at, '%Y-%m')"),
          "month"
        ],
        [
          Sequelize.fn("COUNT", Sequelize.col("foodLog.id")),
          "logCount"
        ]
      ],
      include: [
        {
          model: foodModel,
          as: "food",
          attributes: [],
          where: { userId }
        }
      ],
      where: {
        status: ["consumed", "discarded"]
      },
      group: [
        Sequelize.literal("DATE_FORMAT(foodLog.created_at, '%Y-%m')")
      ],
      raw: true
    })

    // ======================
    // 🔥 2. FOOD (fresh + warning + expired)
    // ======================
    const foodCounts = await foodModel.findAll({
      attributes: [
        [
          Sequelize.literal("DATE_FORMAT(purchase_date, '%Y-%m')"),
          "month"
        ],
        [
          Sequelize.fn("COUNT", Sequelize.col("id")),
          "foodCount"
        ]
      ],
      where: {
        userId,
        status: ["fresh", "warning", "expired"]
      },
      group: [
        Sequelize.literal("DATE_FORMAT(purchase_date, '%Y-%m')")
      ],
      raw: true
    })

    // ======================
    // 🔥 3. KHUSUS DISCARDED
    // ======================
    const discardedLogs = await foodLogModel.findAll({
      attributes: [
        [
          Sequelize.literal("DATE_FORMAT(foodLog.created_at, '%Y-%m')"),
          "month"
        ],
        [
          Sequelize.fn("COUNT", Sequelize.col("foodLog.id")),
          "discardedCount"
        ],
        [
          Sequelize.literal("SUM(foodLog.amount * food.price_of_unit)"),
          "totalPrice"
        ]
      ],
      include: [
        {
          model: foodModel,
          as: "food",
          attributes: [],
          where: { userId }
        }
      ],
      where: {
        status: "discarded"
      },
      group: [
        Sequelize.literal("DATE_FORMAT(foodLog.created_at, '%Y-%m')")
      ],
      raw: true
    })

    // ======================
    // 🔗 4. MERGE
    // ======================
    const result = {}

    logCounts.forEach(item => {
      result[item.month] = {
        month: item.month,
        total_count: Number(item.logCount),
        discarded_count: 0,
        total_price: 0
      }
    })

    foodCounts.forEach(item => {
      if (!result[item.month]) {
        result[item.month] = {
          month: item.month,
          total_count: 0,
          discarded_count: 0,
          total_price: 0
        }
      }

      result[item.month].total_count += Number(item.foodCount)
    })

    discardedLogs.forEach(item => {
      if (!result[item.month]) {
        result[item.month] = {
          month: item.month,
          total_count: 0,
          discarded_count: 0,
          total_price: 0
        }
      }

      result[item.month].discarded_count = Number(item.discardedCount)
      result[item.month].total_price = Number(item.totalPrice || 0)
    })

    // ======================
    // 🔢 5. FINAL
    // ======================
    const finalResult = Object.values(result).map(item => {
      const percentage =
        item.total_count > 0
          ? (item.discarded_count / item.total_count) * 100
          : 0

      return {
        month: item.month,
        discarded_percentage: Number(percentage.toFixed(2)),
        discarded_count: item.discarded_count,
        total_price: item.total_price
      }
    })

    return response.status(200).json({
      success: true,
      message: "Success get discarded monthly dashboard",
      data: finalResult
    })

  } catch (error) {
    return response.status(500).json({
      success: false,
      message: error.message
    })
  }
}

export const getWarningStatusPerMonth = async (request, response) => {
  try {
    const userId = request.user.id

    // ======================
    // 🔥 1. FOOD LOG (consumed + discarded)
    // ======================
    const logCounts = await foodLogModel.findAll({
      attributes: [
        [
          Sequelize.literal("DATE_FORMAT(foodLog.created_at, '%Y-%m')"),
          "month"
        ],
        [
          Sequelize.fn("COUNT", Sequelize.col("foodLog.id")),
          "logCount"
        ]
      ],
      include: [
        {
          model: foodModel,
          as: "food",
          attributes: [],
          where: { userId }
        }
      ],
      where: {
        status: ["consumed", "discarded"]
      },
      group: [
        Sequelize.literal("DATE_FORMAT(foodLog.created_at, '%Y-%m')")
      ],
      raw: true
    })

    // ======================
    // 🔥 2. FOOD (fresh + warning + expired)
    // ======================
    const foodCounts = await foodModel.findAll({
      attributes: [
        [
          Sequelize.literal("DATE_FORMAT(purchase_date, '%Y-%m')"),
          "month"
        ],
        [
          Sequelize.fn("COUNT", Sequelize.col("id")),
          "foodCount"
        ]
      ],
      where: {
        userId,
        status: ["fresh", "warning", "expired"]
      },
      group: [
        Sequelize.literal("DATE_FORMAT(purchase_date, '%Y-%m')")
      ],
      raw: true
    })

    // ======================
    // 🔥 3. KHUSUS WARNING
    // ======================
    const warningFoods = await foodModel.findAll({
      attributes: [
        [
          Sequelize.literal("DATE_FORMAT(purchase_date, '%Y-%m')"),
          "month"
        ],
        [
          Sequelize.fn("COUNT", Sequelize.col("id")),
          "warningCount"
        ],
        [
          Sequelize.literal("SUM(current_weight * price_of_unit)"),
          "totalPrice"
        ]
      ],
      where: {
        userId,
        status: "warning"
      },
      group: [
        Sequelize.literal("DATE_FORMAT(purchase_date, '%Y-%m')")
      ],
      raw: true
    })

    // ======================
    // 🔗 4. MERGE
    // ======================
    const result = {}

    // dari foodLog
    logCounts.forEach(item => {
      result[item.month] = {
        month: item.month,
        total_count: Number(item.logCount),
        warning_count: 0,
        total_price: 0
      }
    })

    // dari food
    foodCounts.forEach(item => {
      if (!result[item.month]) {
        result[item.month] = {
          month: item.month,
          total_count: 0,
          warning_count: 0,
          total_price: 0
        }
      }

      result[item.month].total_count += Number(item.foodCount)
    })

    // inject warning
    warningFoods.forEach(item => {
      if (!result[item.month]) {
        result[item.month] = {
          month: item.month,
          total_count: 0,
          warning_count: 0,
          total_price: 0
        }
      }

      result[item.month].warning_count = Number(item.warningCount)
      result[item.month].total_price = Number(item.totalPrice || 0)
    })

    // ======================
    // 🔢 5. FINAL
    // ======================
    const finalResult = Object.values(result).map(item => {
      const percentage =
        item.total_count > 0
          ? (item.warning_count / item.total_count) * 100
          : 0

      return {
        month: item.month,
        warning_percentage: Number(percentage.toFixed(2)),
        warning_count: item.warning_count,
        total_price: item.total_price
      }
    })

    return response.status(200).json({
      success: true,
      message: "Success get warning monthly dashboard",
      data: finalResult
    })

  } catch (error) {
    return response.status(500).json({
      success: false,
      message: error.message
    })
  }
}

export const getExpiredStatusPerMonth = async (request, response) => {
  try {
    const userId = request.user.id

    // ======================
    // 🔥 1. FOOD LOG (consumed + discarded)
    // ======================
    const logCounts = await foodLogModel.findAll({
      attributes: [
        [
          Sequelize.literal("DATE_FORMAT(foodLog.created_at, '%Y-%m')"),
          "month"
        ],
        [
          Sequelize.fn("COUNT", Sequelize.col("foodLog.id")),
          "logCount"
        ]
      ],
      include: [
        {
          model: foodModel,
          as: "food",
          attributes: [],
          where: { userId }
        }
      ],
      where: {
        status: ["consumed", "discarded"]
      },
      group: [
        Sequelize.literal("DATE_FORMAT(foodLog.created_at, '%Y-%m')")
      ],
      raw: true
    })

    // ======================
    // 🔥 2. FOOD (fresh + warning + expired)
    // ======================
    const foodCounts = await foodModel.findAll({
      attributes: [
        [
          Sequelize.literal("DATE_FORMAT(purchase_date, '%Y-%m')"),
          "month"
        ],
        [
          Sequelize.fn("COUNT", Sequelize.col("id")),
          "foodCount"
        ]
      ],
      where: {
        userId,
        status: ["fresh", "warning", "expired"]
      },
      group: [
        Sequelize.literal("DATE_FORMAT(purchase_date, '%Y-%m')")
      ],
      raw: true
    })

    // ======================
    // 🔥 3. KHUSUS EXPIRED
    // ======================
    const expiredFoods = await foodModel.findAll({
      attributes: [
        [
          Sequelize.literal("DATE_FORMAT(purchase_date, '%Y-%m')"),
          "month"
        ],
        [
          Sequelize.fn("COUNT", Sequelize.col("id")),
          "expiredCount"
        ],
        [
          Sequelize.literal("SUM(current_weight * price_of_unit)"),
          "totalPrice"
        ]
      ],
      where: {
        userId,
        status: "expired"
      },
      group: [
        Sequelize.literal("DATE_FORMAT(purchase_date, '%Y-%m')")
      ],
      raw: true
    })

    // ======================
    // 🔗 4. MERGE
    // ======================
    const result = {}

    // dari foodLog
    logCounts.forEach(item => {
      result[item.month] = {
        month: item.month,
        total_count: Number(item.logCount),
        expired_count: 0,
        total_price: 0
      }
    })

    // dari food
    foodCounts.forEach(item => {
      if (!result[item.month]) {
        result[item.month] = {
          month: item.month,
          total_count: 0,
          expired_count: 0,
          total_price: 0
        }
      }

      result[item.month].total_count += Number(item.foodCount)
    })

    // inject expired
    expiredFoods.forEach(item => {
      if (!result[item.month]) {
        result[item.month] = {
          month: item.month,
          total_count: 0,
          expired_count: 0,
          total_price: 0
        }
      }

      result[item.month].expired_count = Number(item.expiredCount)
      result[item.month].total_price = Number(item.totalPrice || 0)
    })

    // ======================
    // 🔢 5. FINAL
    // ======================
    const finalResult = Object.values(result).map(item => {
      const percentage =
        item.total_count > 0
          ? (item.expired_count / item.total_count) * 100
          : 0

      return {
        month: item.month,
        expired_percentage: Number(percentage.toFixed(2)),
        expired_count: item.expired_count,
        total_price: item.total_price
      }
    })

    return response.status(200).json({
      success: true,
      message: "Success get expired monthly dashboard",
      data: finalResult
    })

  } catch (error) {
    return response.status(500).json({
      success: false,
      message: error.message
    })
  }
}

export const getFreshStatusPerMonth = async (request, response) => {
  try {
    const userId = request.user.id

    // ======================
    // 🔥 1. FOOD LOG (consumed + discarded)
    // ======================
    const logCounts = await foodLogModel.findAll({
      attributes: [
        [
          Sequelize.literal("DATE_FORMAT(foodLog.created_at, '%Y-%m')"),
          "month"
        ],
        [
          Sequelize.fn("COUNT", Sequelize.col("foodLog.id")),
          "logCount"
        ]
      ],
      include: [
        {
          model: foodModel,
          as: "food",
          attributes: [],
          where: { userId }
        }
      ],
      where: {
        status: ["consumed", "discarded"]
      },
      group: [
        Sequelize.literal("DATE_FORMAT(foodLog.created_at, '%Y-%m')")
      ],
      raw: true
    })

    // ======================
    // 🔥 2. FOOD (fresh + warning + expired)
    // ======================
    const foodCounts = await foodModel.findAll({
      attributes: [
        [
          Sequelize.literal("DATE_FORMAT(purchase_date, '%Y-%m')"),
          "month"
        ],
        [
          Sequelize.fn("COUNT", Sequelize.col("id")),
          "foodCount"
        ]
      ],
      where: {
        userId,
        status: ["fresh", "warning", "expired"]
      },
      group: [
        Sequelize.literal("DATE_FORMAT(purchase_date, '%Y-%m')")
      ],
      raw: true
    })

    // ======================
    // 🔥 3. KHUSUS FRESH
    // ======================
    const freshFoods = await foodModel.findAll({
      attributes: [
        [
          Sequelize.literal("DATE_FORMAT(purchase_date, '%Y-%m')"),
          "month"
        ],
        [
          Sequelize.fn("COUNT", Sequelize.col("id")),
          "freshCount"
        ],
        [
          Sequelize.literal("SUM(current_weight * price_of_unit)"),
          "totalPrice"
        ]
      ],
      where: {
        userId,
        status: "fresh"
      },
      group: [
        Sequelize.literal("DATE_FORMAT(purchase_date, '%Y-%m')")
      ],
      raw: true
    })

    // ======================
    // 🔗 4. MERGE
    // ======================
    const result = {}

    // dari foodLog
    logCounts.forEach(item => {
      result[item.month] = {
        month: item.month,
        total_count: Number(item.logCount),
        fresh_count: 0,
        total_price: 0
      }
    })

    // dari food
    foodCounts.forEach(item => {
      if (!result[item.month]) {
        result[item.month] = {
          month: item.month,
          total_count: 0,
          fresh_count: 0,
          total_price: 0
        }
      }

      result[item.month].total_count += Number(item.foodCount)
    })

    // inject fresh
    freshFoods.forEach(item => {
      if (!result[item.month]) {
        result[item.month] = {
          month: item.month,
          total_count: 0,
          fresh_count: 0,
          total_price: 0
        }
      }

      result[item.month].fresh_count = Number(item.freshCount)
      result[item.month].total_price = Number(item.totalPrice || 0)
    })

    // ======================
    // 🔢 5. FINAL
    // ======================
    const finalResult = Object.values(result).map(item => {
      const percentage =
        item.total_count > 0
          ? (item.fresh_count / item.total_count) * 100
          : 0

      return {
        month: item.month,
        fresh_percentage: Number(percentage.toFixed(2)),
        fresh_count: item.fresh_count,
        total_price: item.total_price
      }
    })

    return response.status(200).json({
      success: true,
      message: "Success get fresh monthly dashboard",
      data: finalResult
    })

  } catch (error) {
    return response.status(500).json({
      success: false,
      message: error.message
    })
  }
}

export default {getConsumedStatusPerMonth, getDiscardedStatusPerMonth, getWarningStatusPerMonth, getExpiredStatusPerMonth, getFreshStatusPerMonth}