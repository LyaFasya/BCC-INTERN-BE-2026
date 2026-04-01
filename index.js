import 'dotenv/config'
import express from "express"
import cors from "cors"
import "./services/statusCron.service.js"

import authRoutes from "./routes/auth.route.js"
import profileRoutes from "./routes/userProfile.route.js"
import userRoutes from "./routes/user.route.js"
import categoryRoutes from "./routes/foodCategory.route.js"
import foodRoutes from "./routes/food.route.js"
import foodStatusRoutes from "./routes/foodStatus.route.js"
import wasteTrackerRoutes from "./routes/wasteTracker.route.js"

import createAdmin from "./utils/createAdmin.js"
import swaggerUi from "swagger-ui-express"
import swaggerSpec from "./swagger.js"
import cookieParser from "cookie-parser"

const app = express()
const PORT = process.env.PORT || 8000

const allowedOrigins = [
  process.env.SIMPANIN_URL,
  process.env.SIMPANIN_URL_FE,
  process.env.SIMPANIN_LOKAL,
  process.env.SIMPANIN_LOKAL_FE
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
}));

app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use("/auth", authRoutes)
app.use("/profile", profileRoutes)
app.use("/users", userRoutes)
app.use("/category", categoryRoutes)
app.use("/food", foodRoutes)
app.use("/food_status", foodStatusRoutes)
app.use("/waste_tracker", wasteTrackerRoutes)

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec))

createAdmin()

app.listen(PORT, () => {
  console.log(`Server of Simpanin.id runs on port ${PORT}`)
})

export default app