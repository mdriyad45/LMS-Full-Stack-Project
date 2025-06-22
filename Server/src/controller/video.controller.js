import cloudinary from "../helper/cloudinary.js";
import logger from "../utils/logger.js";

export const uploadVideoController = async (req, res) => {
  logger.info("API hit: uploadVideoController");

  try {
    const { file } = req;

    if (!file) {
      return res.status(400).json({
        success: false,
        message: "No video file provided",
      });
    }

    // Upload video to Cloudinary
    const result = await cloudinary.uploader.upload(file.path, {
      resource_type: "video",
      folder: "LMS_Learning_Project",

      // Enable adaptive streaming
      eager: [
        {
          streaming_profile: "hd",
          format: "m3u8", // HLS
        },
        {
          streaming_profile: "hd",
          format: "mpd", // MPEG-DASH
        },
      ],
      eager_async: true,

      // Optimization settings
      video_codec: "h264",
      audio_codec: "aac",
    });

    console.log(result);
    // Streaming URLs
    const publicId = result.public_id;
    const streamingUrls = {
      hls: cloudinary.url(publicId, {
        resource_type: "video",
        streaming_profile: "hd",
        format: "m3u8",
      }),
      dash: cloudinary.url(publicId, {
        resource_type: "video",
        streaming_profile: "hd",
        format: "mpd",
      }),
      auto: cloudinary.url(publicId, {
        resource_type: "video",
        format: "auto",
        quality: "auto",
      }),
      qualities: {
        low: cloudinary.url(publicId, {
          resource_type: "video",
          quality: "auto:low",
          format: "mp4",
          video_codec: "h264", 
          audio_codec: "aac",
        }),
        medium: cloudinary.url(publicId, {
          resource_type: "video",
          quality: "auto:good",
          format: "mp4",
          video_codec: "h264", 
          audio_codec: "aac",
        }),
        high: cloudinary.url(publicId, {
          resource_type: "video",
          quality: "auto:best",
          format: "mp4",
          video_codec: "h264", 
          audio_codec: "aac",
        }),
      },
    };

    const thumbnail = cloudinary.url(publicId + ".jpg", {
      resource_type: "video",
      transformation: [
        { width: 300, height: 200, crop: "fill" },
        { flags: "animated", delay: 200 },
      ],
    });

    res.status(200).json({
      success: true,
      message: "Video uploaded successfully",
      data: result,
      specific_data: {
        public_id: publicId,
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
    logger.error("Video upload failed:", error.message);
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
