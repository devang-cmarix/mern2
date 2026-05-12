import { Router } from "express";
import { authMiddleware, adminMiddleware } from "../middleware/authMiddleware.js";
import * as categoryController from "../controllers/categoryController.js";

const router = Router();

router.get("/", categoryController.getCategories);
router.get("/:slug", categoryController.getCategoryBySlug);
router.post("/", authMiddleware, adminMiddleware, categoryController.createCategory);
router.put("/:id", authMiddleware, adminMiddleware, categoryController.updateCategory);
router.delete("/:id", authMiddleware, adminMiddleware, categoryController.deleteCategory);

export default router;
