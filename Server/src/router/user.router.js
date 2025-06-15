import {Router} from 'express';
import { loginUser, logout, registerUser } from '../controller/user.controller.js';
import { refreshToken } from '../controller/refreshToken.controller.js';
import { authMidleware } from '../middleware/auth.middleware.js';

const router = Router();

router.route('/register').post(registerUser);
router.route('/login').post(loginUser);
router.route('/logout').get(authMidleware,logout);
router.route('/refreshToken').get(authMidleware,refreshToken);

export default router;

