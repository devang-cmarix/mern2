import { Router } from "express";
import { authMiddleware, adminMiddleware } from "../middleware/authMiddleware.js";
import * as userController from "../controllers/userController.js";

const router = Router();

router.get("/profile", authMiddleware, userController.getProfile);
router.put("/profile", authMiddleware, userController.updateProfile);
router.get("/", authMiddleware, adminMiddleware, userController.getUsers);
router.post("/", authMiddleware, adminMiddleware, userController.createUser);
router.get("/:id", authMiddleware, adminMiddleware, userController.getUserById);
router.put("/:id", authMiddleware, adminMiddleware, userController.updateUser);
router.delete("/:id", authMiddleware, adminMiddleware, userController.deleteUser);

export default router;
