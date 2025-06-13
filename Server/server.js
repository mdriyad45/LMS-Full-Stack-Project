import dotenv from "dotenv";
import express from "express";
import cors from"cors";
import mongoose from "mongoose";
import fs from  "fs";
import path from "path";
import { fileURLToPath } from "url";
import logger from  "./src/utils/logger.js";
import userRouter from  "./src/router/user.router.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

// Recreate __dirname in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// logs directory 
const logsDir = path.join(__dirname, "logs");
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

const corsOptions = {
  origin: process.env.CLIENT_URL,
  methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
  preflightContinue: false,
  optionsSuccessStatus: 204,
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(express.json());
app.use(cors(corsOptions));

// HTTP Request Logger Middleware
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url}`);
  next();
});

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error(`Unhandled error: ${err.message}`);
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: "Something went wrong",
  });
});

//user Router
app.use('/api/v1/user/',userRouter);

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    logger.info("MongoDB connected successfully");
  })
  .catch((e) => {
    logger.error(`MongoDB connection error: ${e.message}`);
  });

app.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`);
});
