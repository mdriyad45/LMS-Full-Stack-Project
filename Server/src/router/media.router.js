import { Router } from "express";
import {

  deleteVideoFromCloudinary,
  getVideoStreamingUrl,
  uploadImageToCloudinaryController,
  uploadVideoController,
} from "../controller/video.controller.js";
import { uploadImage, uploadVideo } from "../middleware/multer.middleware.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = Router();


router.route("/upload").post(authMiddleware,uploadVideo.single('video'),uploadVideoController);
router.route("/getVideo/:videoId").get(authMiddleware, getVideoStreamingUrl);
router.route("/deleteVideo/:videoId").delete(authMiddleware, deleteVideoFromCloudinary);
router.route('/image/upload').post(authMiddleware,uploadImage.single('image'),uploadImageToCloudinaryController)

export default router;
