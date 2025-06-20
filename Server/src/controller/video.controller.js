import cloudinary from "../helper/cloudinary.js";
import logger from "../utils/logger.js";

export const uploadVideoController = async (req, res) => {
  logger.info("api hit uploadVideoController");
  try {
    const { file } = req;

    if (!file) {
      return res.status(400).json({
        success: false,
        message: "No video file provided",
      });
    }
    const result = await cloudinary.uploader.upload(file.path, {
      resource_type: "video",
      folder: "LMS_Learning_Project",

      //Enable adaptive steaming
      eager: [
        {
          streaming_profile: "hd",
          format: "auto",
          quality: "auto:good",
        },
        {
          streaming_profile: "sd",
          format: "auto",
          quality: "auto:low",
        },
        {
          streaming_profile: "full_hd",
          formate: "auto",
          quality: "auto:best",
        },
      ],

      //Enable HLS streaming
      eager_async: true,

      //optimization settings

      video_codec: "auto",
      audio_codec: "auto",

      // Generate streaming URLs

      streaming_profile: "auto",

      //Additional transformation for different qualities

      transformation: [{ quality: "auto", fetch_formate: "auto" }],
    });

    // Generate adaptive streaming URLs
    const streamingUrls = {
      //auto quality adjust based on network
      auto: cloudinary.url(result.public_id, {
        resource_type: "video",
        streaming_profile: "auto",
        quality: "auto",
        format: "auto",
      }),
      // HLS streaming URL for adaptive bitrate
      hls: cloudinary.url(result.public_id, {
        resource_type: "video",
        streaming_profile: "hd",
        format: "m3u8",
      }),

      //DASH streaming URL
      dash: cloudinary.url(result.public_id, {
        resource_type: "video",
        streaming_profile: "hd",
        format: "mpd",
      }),

      //Different quality versions
      qualities: {
        low: cloudinary.url(result.public_id, {
          resource_type: "video",
          quality: "auto:low",
          format: "auto",
        }),
        medium: cloudinary.url(result.public_id, {
          resource_type: "video",
          quality: "auto:good",
          format: "auto",
        }),
        high: cloudinary.url(result.public_id, {
          resource_type: "video",
          quality: "auto:best",
          format: "auto",
        }),
      },
    };

    const thumbnail = cloudinary.url(result.public_id, {
      resource_type: "video",
      format: "jpg",
      transformation: [{ width: 300, height: 200, crop: "fill" }],
    });

    res.status(200).json({
      success: true,
      message: "Video uploaded successfully",
      data: result,
      specific_data: {
        public_id: result.public_id,
        duration: result.duration,
        width: result.width,
        height: result.height,
        format: result.format,
        bytes: result.bytes,
        streaming_urls: streamingUrls,
        thumbnail,
      },
    });
  } catch (error) {
    logger.error("Video upload failed:", error);
    res.status(500).json({
      success: false,
      message: "Video upload failed",
      error: error.message,
    });
  }
};

export const getVideoStreamingUrl = async (req, res) => {
  try {
    const { public_id } = req.params;
    const { quality = "auto" } = req.query;

    //Generate streaming URL based on requested quality

    const streamingUrl = cloudinary.url(public_id, {
      resource_type: "video",
      streaming_profile: quality === "auto" ? "auto" : "hd",
      quality: `auto:${quality}`,
      format: "auto",
    });
    res.status(200).json({
      success: true,
      streaming_url: streamingUrl,
    });
  } catch (error) {
    logger.error("Failed to generate streaming URL:", error);
    res.status(500).json({
      success: false,
      message: "Failed to generate streaming URL",
    });
  }
};
