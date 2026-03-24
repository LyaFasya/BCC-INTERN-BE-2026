import multer from "multer"
import path from "path"

const storage = multer.diskStorage({
  destination: (request, file, cb) => {
    cb(null, "/tmp");
  },
  filename: (request, file, cb) => {
    cb(null, `profile-${Date.now()}${path.extname(file.originalname)}`);
  },
});

const upload = multer({
  storage: storage,
  fileFilter: (request, file, cb) => {
    const allowedTypes = ["image/jpg", "image/jpeg", "image/png"];
    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new Error("Invalid file type (only jpg, jpeg, png allowed)"));
    }
    cb(null, true);
  },

  limits: {
    fileSize: 1 * 1024 * 1024, 
  },
});

export default upload