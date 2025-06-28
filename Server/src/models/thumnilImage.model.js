import mongoose from "mongoose";

const thumbnailCourseSchema = new mongoose.Schema(
  {
    public_id: {
      type: String,
      required: true,
      unique: true,
    },
    
    thumbnailUrl: {
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

export const thumbnailMOdel = mongoose.model("thumbnailMOdel", thumbnailCourseSchema);
