const bcrypt = require("bcryptjs")
const userModel = require("../models").user

const createAdmin = async () => {
  try {
    const email = process.env.ADMIN_EMAIL
    const password = process.env.ADMIN_PASSWORD
    if (!email || !password) {
      console.log("Admin env not set")
      return
    }

    const existing = await userModel.findOne({
      where: { email }
    })
    if (existing) {
      console.log("Admin already exists")
      return
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    await userModel.create({
      email,
      password: hashedPassword,
      role: "admin"
    })
    console.log("Admin created successfully")
  } catch (error) {
    console.error("Error creating admin:", error.message)
  }
}
module.exports = createAdmin