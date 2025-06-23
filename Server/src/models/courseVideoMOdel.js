import mongoose from "mongoose";

const videoCourseSchema = new mongoose.Schema(
  {
    public_id: {
      type: String,
      required: true,
      unique: true,
    },
    title: {
      type: String,
      default: "Untitled Video",
    },
    duration: {
      type: Number,
      required: true,
    },
    width: {
      type: Number,
      required: true,
    },
    height: {
      type: Number,
      required: true,
    },
    format: {
      type: String,
      required: true,
    },
    bytes: {
      type: Number,
      required: true,
    },
    secure_url: {
      type: String,
      required: true,
    },
    streaming_urls: {
      hls: { type: String },
      dash: { type: String },
      auto: { type: String },
      qualities: {
        low: { type: String },
        medium: { type: String },
        high: { type: String },
      },
    },
    thumbnail: {
      type: String,
    },
    
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const CourseVideo = mongoose.model("CourseVideo", videoCourseSchema);
