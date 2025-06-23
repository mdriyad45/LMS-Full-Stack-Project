import multer from "multer";
import fs from "fs";
import path from "path";

// ===== VIDEO UPLOAD =====
const videoUploadFolder = path.join(process.cwd(), "uploadVideo");

const videoStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (!fs.existsSync(videoUploadFolder)) {
      fs.mkdirSync(videoUploadFolder, { recursive: true });
    }
    cb(null, videoUploadFolder);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const videoFileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("video/")) {
    cb(null, true);
  } else {
    cb(new Error("Only video files are allowed!"), false);
  }
};

export const uploadVideo = multer({
  storage: videoStorage,
  fileFilter: videoFileFilter,
  limits: {
    fileSize: 500 * 1024 * 1024, // 500MB
  },
});

// ===== IMAGE UPLOAD =====
const imageUploadFolder = path.join(process.cwd(), "uploadImage");

const imageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (!fs.existsSync(imageUploadFolder)) {
      fs.mkdirSync(imageUploadFolder, { recursive: true });
    }
    cb(null, imageUploadFolder);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const imageFileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed!"), false);
  }
};

export const uploadImage = multer({
  storage: imageStorage,
  fileFilter: imageFileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
});
