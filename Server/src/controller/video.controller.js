import cloudinary from "../helper/cloudinary.js";
import { CourseVideo } from "../models/courseVideoMOdel.js";
import { thumbnailMOdel } from "../models/thumnilImage.model.js";
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

    //save video metadata to the database

    const newVideo = await CourseVideo.create({
      public_id: publicId,
      duration: result.duration,
      width: result.width,
      height: result.height,
      format: result.format,
      bytes: result.bytes,
      secure_url: result.secure_url,
      streaming_urls: streamingUrls,
      thumbnail: thumbnail,
      uploadedBy: req.user._id,
    });

    res.status(200).json({
      success: true,
      message: "Video uploaded successfully",
      data: newVideo,
      cloudinaryResult: result,
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

export const uploadImageToCloudinaryController = async (req, res) => {
  logger.info("api hit uploadImageToCloudinaryController");
  try {
    const { file } = req;

    if (!file) {
      return res.status(400).json({
        success: false,
        message: "No Image file provided",
      });
    }
    const result = await cloudinary.uploader.upload(file.path, {
      resource_type: "auto",
      folder: "LMS_Learning_Project",
    });

    if (!result) {
      return res.status(400).json({
        success: false,
        message: "Cloudinary Image Upload fail",
      });
    }

    const storeData = await thumbnailMOdel.create({
      public_id: result.public_id,
      thumbnailUrl: result.secure_url,
      uploadedBy: req.user._id,
    });

    res.status(200).json({
      success: true,
      message: "Image uploaded successfully",
      data: storeData,
    });
  } catch (error) {
    logger.error("Image upload failed:", error);
    res.status(500).json({
      success: false,
      message: "Image upload failed",
      error: error.message,
    });
  }
};

export const getVideoStreamingUrl = async (req, res) => {
  logger.info("API hit: getVideoStreamingUrl");

  try {
    const { videoId } = req.params;
    const { quality = "auto" } = req.query;

    if (!videoId) {
      return res.status(400).json({
        success: false,
        message: "Please provide a video ID",
      });
    }

    const video = await CourseVideo.findById(videoId);
    if (!video) {
      return res.status(404).json({
        success: false,
        message: "Video not found in the database",
      });
    }

    const videoPublicId = video.public_id;

    const transformationOptions =
      quality === "auto"
        ? {
            streaming_profile: "auto",
            format: "auto",
          }
        : {
            streaming_profile: "hd",
            quality: `auto:${quality}`,
            format: "mp4",
          };

    const streamingUrl = cloudinary.url(videoPublicId, {
      resource_type: "video",
      ...transformationOptions,
    });

    res.status(200).json({
      success: true,
      message: "Video URL fetched successfully",
      streaming_url: streamingUrl,
    });
  } catch (error) {
    logger.error("Failed to generate streaming URL:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to generate streaming URL",
      error: error.message,
    });
  }
};

export const deleteVideoFromCloudinary = async (req, res) => {
  logger.info("API hit: deleteVideoController");

  try {
    const { videoId } = req.params;
    console.log("videoId:", videoId);

    if (!videoId) {
      return res.status(400).json({
        success: false,
        message: "Please provide video ID",
      });
    }

    const video = await CourseVideo.findById(videoId);
    console.log("video: ", video);
    if (!video) {
      return res.status(404).json({
        success: false,
        message: "Video not found in the database",
      });
    }

    const videoPublicId = video.public_id;

    console.log("videoPublicId:", videoPublicId);

    logger.info(`Deleted video metadata from DB: ${videoId}`);

    const cloudinaryResponse = await cloudinary.uploader.destroy(
      videoPublicId,
      {
        resource_type: "video",
      }
    );

    console.log("cloudinary Response: ", cloudinaryResponse);

    if (cloudinaryResponse.result === "ok") {
      await CourseVideo.findByIdAndDelete(videoId);
    }
    if (
      cloudinaryResponse.result !== "ok" &&
      cloudinaryResponse.result !== "not found"
    ) {
      return res.status(500).json({
        success: false,
        message: "Failed to delete video from Cloudinary",
        cloudinaryResponse,
      });
    }

    res.status(200).json({
      success: true,
      message: "Video deleted successfully from both database and Cloudinary",
    });
  } catch (error) {
    logger.error("Error deleting video:", error);
    res.status(500).json({
      success: false,
      message: "Server error while deleting video",
      error: error.message,
    });
  }
};

export const deleteThumnailImageFromCloudinary = async (req, res) => {
  logger.info("API hit: deleteThumnailImageFromCloudinary");

  try {
    const { _id } = req.params;
    console.log(_id);

    if (!_id) {
      return res.status(400).json({
        success: false,
        message: "Please provide image ID",
      });
    }

    const image = await thumbnailMOdel.findById(_id);
    console.log("image: ", image);
    if (!image) {
      return res.status(404).json({
        success: false,
        message: "Image not found in the database",
      });
    }

    const imagePublicId = image.public_id;
    console.log("imagePublicId:", imagePublicId);

    await thumbnailMOdel.findByIdAndDelete(_id);
    logger.info(`Deleted image metadata from DB: ${_id}`);

    const cloudinaryResponse = await cloudinary.uploader.destroy(
      imagePublicId,
      {
        resource_type: "image",
      }
    );
    console.log("cloudinaryResponse: ", cloudinaryResponse);
    if (cloudinaryResponse.result === "ok") {
      await thumbnailMOdel.findByIdAndDelete(_id);
    }
    if (
      cloudinaryResponse.result !== "ok" &&
      cloudinaryResponse.result !== "not found"
    ) {
      return res.status(500).json({
        success: false,
        message: "Failed to delete iamge from Cloudinary",
        cloudinaryResponse,
      });
    }

    res.status(200).json({
      success: true,
      message: "image deleted successfully from both database and Cloudinary",
    });
  } catch (error) {
    logger.error("Error deleting image:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error while deleting image",
      error: error.message,
    });
  }
};
