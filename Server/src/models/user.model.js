import  mongoose  from "mongoose";
import argon2 from "argon2";
import logger from "../utils/logger.js";
import jwt from "jsonwebtoken";

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
    },
    refreshToken: {
      type: String,
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
      next();
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

userSchema.methods.generateAccessToken = function () {
  try {
    return jwt.sign(
      {
        _id: this._id,
        userEmail: this.userEmail,
        userName: this.userName,
        role: this.role,
      },
      process.env.ACCESS_TOKEN_EXPIRY_TOKEN_SECRET,
      { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
    );
  } catch (error) {
    logger.error(error.message);
  }
};

userSchema.methods.generateRefreshToken = function () {
  try {
    return jwt.sign(
      {
        _id: this._id,
      },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: process.env.REFRESH_TOKEN_EXPIRY}
    );
  } catch (error) {
    logger.error(error.message);
  }
};

userSchema.index({ userName: "text" });
export const User = mongoose.model("User", userSchema);
