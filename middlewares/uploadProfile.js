import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadDir = path.join(__dirname, "../image/profile");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (request, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (request, file, cb) => {
    const ext = path.extname(file.originalname);
    const fileName = `profile-${Date.now()}${ext}`;
    cb(null, fileName);
  },
});

const upload = multer({
  storage,
  fileFilter: (request, file, cb) => {
    const allowedTypes = ["image/jpg", "image/jpeg", "image/png"];
    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new Error("Invalid file type"), false);
    }
    cb(null, true);
  },
  limits: {
    fileSize: 2 * 1024 * 1024,
  },
});

export default upload;