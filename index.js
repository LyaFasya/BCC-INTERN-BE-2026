require("dotenv").config()

const express = require("express")
const app = express()
const PORT = process.env.PORT || 8000
const authRoutes = require("./routes/auth.route")
const profileRoutes = require("./routes/userProfile.route")
const userRoutes = require("./routes/user.route")
const categoryRoutes = require("./routes/foodCategory.route")
// const foodRoutes = require("./routes/food.route")

const createAdmin = require("./utils/createAdmin")
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./swagger");

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use("/image", express.static("image"))

app.use("/auth", authRoutes)
app.use("/profile", profileRoutes)
app.use("/users", userRoutes)
app.use("/category", categoryRoutes)
// app.use("/food", foodRoutes)

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

createAdmin()
app.listen(PORT, () => {
  console.log(`Server of Simpanin.id runs on port ${PORT}`)
})

module.exports = app