import express from "express";
import { deleteUser, updateUser } from "../controllers/user.controller.js";
import { authorize, protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.put("/:id", updateUser);
router.delete("/:id", protect, authorize("admin"), deleteUser);

export default router;
