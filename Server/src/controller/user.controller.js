import { User } from "../models/user.model.js";
import logger from "../utils/logger.js";
import { validateInputs } from "../utils/validateInputs.js";

const generateAccessTokenAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();

    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    logger.error(
      "Something went wrong while generate refresh and access token"
    );
    throw new Error("Failed to generate access and refresh tokens");
  }
};

export const registerUser = async (req, res) => {
  try {
    const { userName, userEmail, password, role } = req.body;

    // const requiredFields = { userName, userEmail, password, role };
    // for (const [field, value] of Object.entries(requiredFields)) {
    //   if (!value) {
    //     return res.status(400).json({
    //       success: false,
    //       message: `${field} is required`,
    //     });
    //   }
    // }

    validateInputs(userName, userEmail, password);

    const existingUser = await User.findOne({
      $or: [{ userName }, { userEmail }],
    });

    if (existingUser) {
      return res.status(400).json({
        succss: false,
        message: "User name or user email already exists",
      });
    }

    const user = await User.create({
      userName,
      userEmail,
      password,
      role,
    });

    const createUser = await User.findById(user._id).select("-password");

    res.status(201).json({
      message: "User create successfully",
      data: createUser,
      succss: true,
      error: false,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message || error,
      success: false,
      error: true,
    });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { userEmail, password } = req.body;
    console.log(userEmail, password);

    if (!userEmail || !password) {
      logger.error("userName and password must required");
      throw new Error("userName and password must required");
    }

    const existUser = await User.findOne({ userEmail });

    if (!existUser) {
      logger.error("User not found");
      throw new Error("User not found");
    }

    const isPasswordValid = await existUser.isPasswordCorrect(password);
    if (!isPasswordValid) {
      throw new Error("Invalid user credentials");
    }

    const { accessToken, refreshToken } =
      await generateAccessTokenAndRefreshToken(existUser._id);

    const loggedInUser = await User.findById(existUser._id).select(
      "-password -refreshToken"
    );

    const options = {
      httpOnly: true,
      secure: true,
    };

    res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json({
        message: "user logged in successfully",
        data: { loggedInUser, accessToken, refreshToken },
        success: true,
        error: false,
      });
  } catch (error) {
    res.status(400).json({
      message: error.message,
      success: false,
      error: true,
    });
  }
};
