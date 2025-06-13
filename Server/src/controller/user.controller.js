import {User} from "../models/user.model.js";
import logger from "../utils/logger.js";
import { validateInputs } from "../utils/validateInputs.js";

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
    logger.error(`Error in registerUser: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Failed to register user",
      error: error.message,
    });
  }
};
