import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import * as authController from "../controllers/authController.js";

const router = Router();

router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.get("/me", authMiddleware, authController.getCurrentUser);
router.post("/change-password", authMiddleware, authController.changePassword);

export default router;
