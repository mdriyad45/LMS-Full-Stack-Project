import multer from "multer";
import fs from "fs";
import path from "path";

// ✅ Correctly define the path
const uploadFolder = path.join(process.cwd(), "uploadVideo");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // ✅ Check if folder exists, if not create it
    if (!fs.existsSync(uploadFolder)) {
      fs.mkdirSync(uploadFolder, { recursive: true });
    }
    cb(null, uploadFolder); // ✅ Must be a string path
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("video/")) {
    cb(null, true);
  } else {
    cb(new Error("Only video files are allowed!"), false);
  }
};

export const uploadVideo = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 500 * 1024 * 1024, // 500MB max size
  },
});
