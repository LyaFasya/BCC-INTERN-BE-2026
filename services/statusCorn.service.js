import cron from "node-cron"
import db from "../models/index.js"
const foodModel = db.food

const updateFoodStatus = async () => {
  const foods = await foodModel.findAll()
  const today = new Date()

  for (const food of foods) {
    const expiryDate = new Date(food.expiryDate)
    const diffDays = Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24))
    let newStatus = "fresh"
    if (food.currentWeight === 0) {
      newStatus = "consumed"
    } else if (diffDays <= 0) {
      newStatus = "expired"
    } else if (diffDays <= 3) {
      newStatus = "warning"
    }

    if (food.status !== newStatus) {
      await food.update({ status: newStatus })
    }
  }

  console.log("Food status updated")
}

updateFoodStatus()
cron.schedule("0 0 * * *", async () => {
  console.log("Running daily food status update...")
  await updateFoodStatus()
})