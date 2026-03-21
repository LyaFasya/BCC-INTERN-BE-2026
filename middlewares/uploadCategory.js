const multer = require("multer")
const path = require("path")
const fs = require("fs")

const uploadDir = path.join(__dirname, "../image/category")
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true })
}
const storage = multer.diskStorage({
  destination: (request, file, cb) => {
    cb(null, uploadDir)
  },
  filename: (request, file, cb) => {
    const ext = path.extname(file.originalname)
    const fileName = `category-${Date.now()}${ext}`
    cb(null, fileName)
  }
})

const fileFilter = (request, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/jpg"]
  if (!allowedTypes.includes(file.mimetype)) {
    return cb(new Error("Only image files are allowed"), false)
  }
  cb(null, true)
}

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 2 * 1024 * 1024
  }
})

module.exports = upload