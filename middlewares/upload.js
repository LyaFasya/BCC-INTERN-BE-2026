import multer from "multer";

const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
  fileFilter: (request, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new Error("Invalid file type"));
    }
    cb(null, true);
  },
  limits: {
    fileSize: 1 * 1024 * 1024,
  },
});

export default upload;