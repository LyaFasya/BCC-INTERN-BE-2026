import db from "../models/index.js"
import { Sequelize } from "sequelize"

const { food: foodModel, foodLog: foodLogModel } = db 

const buildStatusMonthly = async (userId, targetStatus, isLogBased) => {
  const [logCounts, foodCounts, targetData] = await Promise.all([
    foodLogModel.findAll({
      attributes: [
        [Sequelize.literal("DATE_FORMAT(foodLog.created_at, '%Y-%m')"), "month"],
        [Sequelize.fn("COUNT", Sequelize.col("foodLog.id")), "count"]
      ],
      include: [{ model: foodModel, as: "food", attributes: [], where: { userId } }],
      where: { status: ["consumed", "discarded"] },
      group: [Sequelize.literal("DATE_FORMAT(foodLog.created_at, '%Y-%m')")],
      raw: true
    }),

    foodModel.findAll({
      attributes: [
        [Sequelize.literal("DATE_FORMAT(purchase_date, '%Y-%m')"), "month"],
        [Sequelize.fn("COUNT", Sequelize.col("id")), "count"]
      ],
      where: { userId, status: ["fresh", "warning", "expired"] },
      group: [Sequelize.literal("DATE_FORMAT(purchase_date, '%Y-%m')")],
      raw: true
    }),

    isLogBased
      ? foodLogModel.findAll({
          attributes: [
            [Sequelize.literal("DATE_FORMAT(foodLog.created_at, '%Y-%m')"), "month"],
            [Sequelize.fn("COUNT", Sequelize.col("foodLog.id")), "targetCount"],
            [Sequelize.literal("SUM(foodLog.amount * food.price_of_unit)"), "totalPrice"]
          ],
          include: [{ model: foodModel, as: "food", attributes: [], where: { userId } }],
          where: { status: targetStatus },
          group: [Sequelize.literal("DATE_FORMAT(foodLog.created_at, '%Y-%m')")],
          raw: true
        })
      : foodModel.findAll({
          attributes: [
            [Sequelize.literal("DATE_FORMAT(purchase_date, '%Y-%m')"), "month"],
            [Sequelize.fn("COUNT", Sequelize.col("id")), "targetCount"],
            [Sequelize.literal("SUM(current_weight * price_of_unit)"), "totalPrice"]
          ],
          where: { userId, status: targetStatus },
          group: [Sequelize.literal("DATE_FORMAT(purchase_date, '%Y-%m')")],
          raw: true
        })
  ])

  const resultObj = {}
  const ensureMonth = (month) => {
    if (!resultObj[month]) {
      resultObj[month] = { month, total_count: 0, target_count: 0, total_price: 0 }
    }
  }

  logCounts.forEach(item => {
    ensureMonth(item.month)
    resultObj[item.month].total_count += Number(item.count)
  })

  foodCounts.forEach(item => {
    ensureMonth(item.month)
    resultObj[item.month].total_count += Number(item.count)
  })

  targetData.forEach(item => {
    ensureMonth(item.month)
    resultObj[item.month].target_count = Number(item.targetCount || 0)
    resultObj[item.month].total_price = Number(item.totalPrice || 0)
  })

  return Object.values(resultObj)
    .sort((a, b) => a.month.localeCompare(b.month))
    .map(item => {
      const percentage = item.total_count > 0 
        ? (item.target_count / item.total_count) * 100 
        : 0

      return {
        month: item.month,
        [`${targetStatus}_percentage`]: Number(percentage.toFixed(2)),
        [`${targetStatus}_count`]: item.target_count,
        total_price: item.total_price
      }
    })
}

const createPerStatusHandler = (targetStatus, isLogBased) => async (request, response) => {
  try {
    const userId = request.user.id
    const data = await buildStatusMonthly(userId, targetStatus, isLogBased)
    
    return response.status(200).json({
      success: true,
      message: `Success get ${targetStatus} monthly dashboard`,
      data
    })
  } catch (error) {
    return response.status(500).json({
      success: false,
      message: error.message
    })
  }
}

export const getConsumedStatusPerMonth = createPerStatusHandler("consumed", true)
export const getDiscardedStatusPerMonth = createPerStatusHandler("discarded", true)
export const getWarningStatusPerMonth = createPerStatusHandler("warning", false)
export const getExpiredStatusPerMonth = createPerStatusHandler("expired", false)
export const getFreshStatusPerMonth = createPerStatusHandler("fresh", false)

export default {getConsumedStatusPerMonth, getDiscardedStatusPerMonth, getWarningStatusPerMonth, getExpiredStatusPerMonth, getFreshStatusPerMonth}