import cron from 'node-cron'
import { Op } from 'sequelize'
import db from '../models/index.js'

const { food: Food, notification: Notification, user: User } = db

cron.schedule('0 0 * * *', async () => {
  console.log("CRON JALAN")

  const today = new Date()

  const hMinus3 = new Date()
  hMinus3.setDate(today.getDate() + 3)

  try {
    const warningFoods = await Food.findAll({
      where: {
        expiryDate: {
          [Op.lte]: hMinus3,
          [Op.gt]: today
        },
        status: 'fresh'
      },
      include: [{ model: User }]
    })

    for (const food of warningFoods) {
      await food.update({ status: 'warning' })

      await sendEmail(
        food.user.email,
        'Makanan Hampir Expired ⚠️',
        `<p>${food.foodName} akan expired pada ${food.expiryDate}</p>`
      )

      await Notification.create({
        user_id: food.userId,
        food_id: food.id,
        title: 'Makanan Hampir Expired',
        message: `${food.foodName} akan expired`,
        type: 'warning',
        is_read: false
      })
    }

    const expiredFoods = await Food.findAll({
      where: {
        expiryDate: {
          [Op.lte]: today
        },
        status: {
          [Op.ne]: 'expired'
        }
      },
      include: [{ model: User }]
    })

    for (const food of expiredFoods) {
      await food.update({ status: 'expired' })

      await sendEmail(
        food.user.email,
        'Makanan Sudah Expired ❌',
        `<p>${food.foodName} sudah expired</p>`
      )

      await Notification.create({
        user_id: food.userId,
        food_id: food.id,
        title: 'Makanan Expired',
        message: `${food.foodName} sudah expired`,
        type: 'expired',
        is_read: false
      })
    }

    console.log("CRON JALAN:", new Date())
    console.log("WARNING FOODS:", warningFoods.length)
    console.log("EXPIRED FOODS:", expiredFoods.length)
    console.log("CRON SELESAI")

  } catch (error) {
    console.log("ERROR CRON:", error)
  }
})