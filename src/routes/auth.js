import express from "express";
import { getProfileController, loginController, logout, refresh, registerController } from "../controllers/auth.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import { loginValidator, registerValidator } from "../validators/auth.validator.js";
const router = express.Router();

router.post("/register", registerValidator, registerController);
router.post("/login", loginValidator, loginController);
router.post("/refresh-token", refresh);
router.post("/logout", protect, logout);
router.get("/me", protect, getProfileController);
export default router;
