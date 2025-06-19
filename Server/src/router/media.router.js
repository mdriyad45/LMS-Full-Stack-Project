import { getVideoStreamingUrl, uploadVideoController } from "../controller/video.controller"
import { uploadVideo } from "../middleware/multer.middleware"



const router = Router()

router.post("/upload", authMiddleware, uploadVideo.single("video"), uploadVideoController)
router.get("/stream/:publicId", getVideoStreamingUrl)

export default router
