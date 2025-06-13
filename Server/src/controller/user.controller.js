import userModel from "../models/user.model.js";

export const registerUser = async (req, res) => {
  try {
    const { userName, userEmail, password, role } = req.body;
    if (!userName) {
      throw new Error("userName not found");
    }
    if (!userEmail) {
      throw new Error("userEmail not found");
    }
    if (!password) {
      throw new Error("password not found");
    }
    if (!role) {
      throw new Error("role not found");
    }

    const existingUser = await userModel.findOne({
      $or: [{ username }, { userEmail }],
    });

    if (existingUser) {
      return res.status(400).json({
        succss: false,
        message: 'User name or user email already exists'
      })
    }

    const user = userModel.create({
      userName,
      userEmail,
      password,
      role,
    });
    await user.save();

    res.status(201).json({
      message: "User create successfully",
      data: user,
      succss: true,
      error: false,
    });
  } catch (error) {}
};
