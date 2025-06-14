import jwt from "jsonwebtoken";
import { User } from "../models/user.model";
export const authMidleware = async (req, _, next) => {
  try {
    const token =
      req.cookies.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      throw new Error("Unauthorized request");
    }

    const decodeToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const user = await User.findById(decodeToken._id).select(
      "-password -refreshToken"
    );

    if (!user) {
      throw new Error("Invalid Access Token");
    }

    req.user = user;
    next();
  } catch (error) {
    console.error(error);
    throw new apiError(401, "Invalid access Token");
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

