import { Router } from "express";
import {
  getVideoStreamingUrl,
  uploadVideoController,
} from "../controller/video.controller.js";
import { uploadVideo } from "../middleware/multer.middleware.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = Router();


router.route("/upload").post(authMiddleware,uploadVideo.single('video'),uploadVideoController);
router.route('/getVideo/:publicId', authMiddleware, getVideoStreamingUrl);

export default router;
