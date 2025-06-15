import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
export const authMiddleware = async (req, res, next) => {
  try {
    const token =
      req.cookies.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({
        success: false,
        error: true,
        message: "No token provided",
      });
    }

    const decodeToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const user = await User.findById(decodeToken._id).select(
      "-password -refreshToken"
    );

    if (!user) {
      return res.status(401).json({
        success: false,
        error: true,
        message: "Invalid token user",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error(error);
    return res.status(401).json({
      success: false,
      error: true,
      message: "Invalid or expired token",
    });
  }
};

export const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!allowedRoles.includes(req?.user?.role)) {
      return res.status(403).json({
        message: `Access denied for role: ${req.user?.role}`,
        success: false,
        error: true,
      });
    }
    next();
  };
};
