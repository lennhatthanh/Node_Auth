import express from "express";
import { getProfileController, loginController, registerController } from "../controllers/auth.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import { loginValidator, registerValidator } from "../validators/auth.validator.js";
const router = express.Router();

router.post('/register', registerValidator, registerController);
router.post('/login', loginValidator, loginController);

router.get('/me', protect, getProfileController);
export default router;
