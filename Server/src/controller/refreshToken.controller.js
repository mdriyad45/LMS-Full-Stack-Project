import jwt from "jsonwebtoken";
export const refreshToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    console.log(refreshToken);
    const payload = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

    const newAccessToken = jwt.sign(
      {
        _id: payload._id,
      },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: "15m",
      }
    );

    const options = {
      httpOnly: true,
      secure: true,
      sameSite: "Lax",
      maxAge: 15 * 60 * 1000,
    };
    res.cookie("accessToken", newAccessToken, options);
    res.json({ success: true });
  } catch (error) {
    res.status(401).json({ success: false, message: "Unauthorized" });
  }
};
