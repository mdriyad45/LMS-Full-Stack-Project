import { Router } from "express";
import {

  deleteVideoFromCloudinary,
  getVideoStreamingUrl,
  uploadVideoController,
} from "../controller/video.controller.js";
import { uploadVideo } from "../middleware/multer.middleware.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = Router();


router.route("/upload").post(authMiddleware,uploadVideo.single('video'),uploadVideoController);
router.route("/getVideo/:videoId").get(authMiddleware, getVideoStreamingUrl);
router.route("/deleteVideo/:videoId").get(authMiddleware, deleteVideoFromCloudinary);

export default router;
