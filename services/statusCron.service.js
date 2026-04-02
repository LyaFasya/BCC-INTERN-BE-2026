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

    const formatDateId = (dateVal) => {
        if (!dateVal) return ''
        const d = new Date(dateVal)
        if (isNaN(d.getTime())) return String(dateVal)
        const day = d.getDate()
        const month = d.getMonth()
        const year = d.getFullYear()
        const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember']
        return `${day} ${months[month]} ${year}`
    }

    const SIMPANIN_URL_FE = process.env.SIMPANIN_URL_FE

    for (const userId in userNotificationsMap) {
       const userBag = userNotificationsMap[userId]
       const { user, items } = userBag
       
       const groups = {
           expiry_3: { diffDays: 3, title: "🚨 3 Hari Lagi! Bahan Makananmu Akan Segera Kadaluwarsa", label: "dalam 3 hari ke depan", items: [] },
           expiry_2: { diffDays: 2, title: "🚨 2 Hari Lagi! Bahan Makananmu Akan Segera Kadaluwarsa", label: "dalam 2 hari ke depan", items: [] },
           expiry_1: { diffDays: 1, title: "🚨 1 Hari Lagi! Bahan Makananmu Akan Segera Kadaluwarsa", label: "besok", items: [] },
           expired:  { diffDays: 0, title: "☠️ Bahan Makananmu Telah Kadaluwarsa!", label: "telah melewati batas kadaluarsa hari ini", items: [] }
       }

       for (const item of items) {
           if (groups[item.type]) {
               groups[item.type].items.push(item)
           }
       }

       for (const key in groups) {
           const group = groups[key]
           if (group.items.length === 0) continue

           let listHtml = ''
           for (const item of group.items) {
               listHtml += `<li style="margin-bottom: 5px">${item.food.foodName} (exp: ${formatDateId(item.food.expiryDate)})</li>\n`
           }
           
           let desc = group.diffDays > 0 
               ? `akan segera mendekati tanggal kadaluarsa ${group.label}.` 
               : `telah melewati batas kadaluarsa hari ini.`

           let htmlContent = `
             <div style="font-family: sans-serif color: #333 line-height: 1.6 max-width: 600px margin: auto">
               <h2 style="color: ${group.diffDays > 0 ? '#ff9800' : '#f44336'}">${group.title}</h2>
               <p>Halo!</p>
               <p>Kami ingin mengingatkan bahwa beberapa bahan makanan yang kamu simpan di Simpanin.id ${desc}</p>
               
               <p>🛒 <strong>Daftar bahan:</strong></p>
               <ul>
                 ${listHtml}
               </ul>

               <p>Yuk mulai rencanakan untuk menggunakannya agar tidak terbuang 🌱</p>
               
               <p>Cek bahanmu sekarang di <a href="${SIMPANIN_URL_FE}" style="color: #007bff text-decoration: none">Simpanin.id</a><br/>
               Pastikan untuk menggunakan atau membuangnya untuk melacak statistik <em>Waste Tracker</em> Anda!</p>

               <hr style="border: none border-top: 1px solid #eee margin: 25px 0">

               <p>💡 <strong> Kamu butuh ide masakan dari bahan yang ada?</strong><br/>
               Upgrade ke Premium hanya <strong>Rp19.000/bulan</strong> dan dapatkan:<br/>
                Ide masakan berdasarkan bahan yang kamu punya lewat email!</p>

               <p>Salam,<br/><strong>Tim Simpanin.id</strong><br/><em>Smarter Food Storage Starts Here.</em></p>
             </div>
           `
           
           if (user && user.email) {
               try {
                   await sendEmail(user.email, group.title, htmlContent)
               } catch (err) {
                   console.log(`ERROR EMAIL to ${user.email} (type: ${key}):`, err.response ? err.response.body : err)
               }
           }
       }

       for (const item of items) {
         let title = "Makanan Hampir Expired"
         let message = `${item.food.foodName} akan expired dalam waktu ${item.diffDays} hari.`
         if (item.type === 'expired') {
            title = "Makanan Sudah Expired"
            message = `${item.food.foodName} telah melewati tanggal expired.`
         }

         try {
             await Notification.create({
                userId: user ? user.id : userId,       
                foodId: item.food.id,
                title,
                message,
                type: item.type,
                isRead: false
             })
         } catch (err) {
             console.log("ERROR NOTIFICATION CREATE:", err)
         }
       }
    }

    console.log(`CRON SELESAI: ${new Date().toISOString()} - Processed notifications for ${Object.keys(userNotificationsMap).length} users.`)

  } catch (error) {
    console.log("ERROR CRON:", error)
  }
}

cron.schedule('* * * * *', runFoodStatusCheck)