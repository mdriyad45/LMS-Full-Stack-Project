import {mongoose} from 'mongoose';
import argon2 from 'argon2';
import logger from "../utils/logger.js"


const userSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: true,
      unique: true,
    },
    userEmail: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      default: "student",
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    try {
      this.password = await argon2.hash(this.password);
    } catch (error) {
      next(error);
    }
  } else {
    next();
  }
});

userSchema.methods.isPasswordCorrect = async function (cadidatePassword) {
  try {
    return await argon2.verify(this.password, cadidatePassword);
  } catch (error) {
    logger.error("Password comparison failed");
    throw new Error("Password comparison failed");
  }
};

userSchema.index({ userName: "text" });
export const User = mongoose.model("User", userSchema);
