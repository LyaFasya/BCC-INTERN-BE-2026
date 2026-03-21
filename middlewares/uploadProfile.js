const multer = require("multer")
const path = require("path")

const storage = multer.diskStorage({
  destination: (request, file, cb) => {
    cb(null, "./image/profile")
  },

  filename: (request, file, cb) => {
    cb(null, `profile-${Date.now()}${path.extname(file.originalname)}`)
  }
})

const upload = multer({
  storage: storage,
  fileFilter: (request, file, cb) => {
    const allowedTypes = ["image/jpg", "image/jpeg", "image/png"]
    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new Error("Invalid file type"))
    }
    cb(null, true)
  },
  limits: {
    fileSize: 2 * 1024 * 1024
  }
})

module.exports = upload