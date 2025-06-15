import { Router } from "express";
import {
  checkAuth,
  loginUser,
  logout,
  registerUser,
} from "../controller/user.controller.js";
import { refreshToken } from "../controller/refreshToken.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").get(authMiddleware, logout);
router.route("/refreshToken").get(authMiddleware, refreshToken);
router.route("/check-auth").get(authMiddleware, checkAuth);

export default router;
