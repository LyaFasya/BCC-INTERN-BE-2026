import cron from 'node-cron'
import { Op } from 'sequelize'
import db from '../models/index.js'
import sendEmail from './email.service.js'

const { food: Food, notification: Notification, user: User } = db

export const runFoodStatusCheck = async () => {
  console.log("CRON JALAN (Daily Food Status Check)")

  try {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    const activeFoods = await Food.findAll({
      where: {
        status: {
          [Op.in]: ['fresh', 'warning', 'expired']
        }
      },
      include: [{ model: User }]
    })

    if (activeFoods.length === 0) {
       console.log("CRON SELESAI: No active foods to check.")
       return
    }
    const userNotificationsMap = {}

    for (const food of activeFoods) {
      const expDate = new Date(food.expiryDate)
      expDate.setHours(0, 0, 0, 0)
      
      const diffTime = expDate - today
      const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24))
      
      let targetType = null
      let newStatus = food.status
      
      if (diffDays === 3) targetType = 'expiry_3'
      else if (diffDays === 2) targetType = 'expiry_2'
      else if (diffDays === 1) targetType = 'expiry_1'
      else if (diffDays <= 0) targetType = 'expired'

      if (diffDays <= 3 && diffDays > 0) newStatus = 'warning'
      else if (diffDays <= 0) newStatus = 'expired'

      if (newStatus !== food.status) {
        await food.update({ status: newStatus })
      }

      if (targetType) {
        const existingNotif = await Notification.findOne({
          where: {
            foodId: food.id,
            type: targetType
          }
        })

        if (!existingNotif) {
          if (!userNotificationsMap[food.userId]) {
            userNotificationsMap[food.userId] = {
              user: food.user,
              items: []
            }
          }
          userNotificationsMap[food.userId].items.push({
            food,
            diffDays,
            type: targetType
          })
        }
      }
    }

    for (const userId in userNotificationsMap) {
       const userBag = userNotificationsMap[userId]
       const { user, items } = userBag
       
       let htmlContent = `
         <div style="font-family: sans-serif; max-width: 600px; margin: auto;">
           <h2>Halo 👋</h2>
           <p>Berikut adalah ringkasan barang belanjaan Anda yang mendekati masa expired atau sudah expired:</p>
           <ul>
       `
       
       for (const item of items) {
           const badge = item.type === 'expired' 
               ? '<strong style="color:red">[Sudah Expired]</strong>' 
               : `<strong style="color:orange">[H-${item.diffDays} Warning]</strong>`
           
           htmlContent += `
             <li style="margin-bottom: 10px;">
               <strong>${item.food.foodName}</strong><br/>
               <small>Expired pada: ${item.food.expiryDate}</small> ${badge}
             </li>
           `
       }

       htmlContent += `
           </ul>
           <p>Pastikan untuk menggunakan atau membuangnya untuk melacak statistik *Waste Tracker* Anda!</p>
         </div>
       `
       
       if (user && user.email) {
           await sendEmail(user.email, 'Simpanin: Notifikasi Bahan Makanan', htmlContent)
       }

       for (const item of items) {
         let title = "Makanan Hampir Expired"
         let message = `${item.food.foodName} akan expired dalam waktu ${item.diffDays} hari.`
         if (item.type === 'expired') {
            title = "Makanan Sudah Expired"
            message = `${item.food.foodName} telah melewati tanggal expired.`
         }

         await Notification.create({
            userId: user.id,       
            foodId: item.food.id,
            title,
            message,
            type: item.type,
            isRead: false
         })
       }
    }

    console.log(`CRON SELESAI: ${new Date().toISOString()} - Sent batched emails to ${Object.keys(userNotificationsMap).length} users.`)

  } catch (error) {
    console.log("ERROR CRON:", error)
  }
}

cron.schedule('0 0 * * *', runFoodStatusCheck)