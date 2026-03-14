const express = require("express")
const app = express()
const PORT = process.env.PORT || 8000
const authRoutes = require('./routes/auth.route')

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use('/auth', authRoutes)

module.exports = app

require("dotenv").config()

app.listen(PORT, () => {
    console.log(`Server of Simpanin.id runs on port ${PORT}`)
})
