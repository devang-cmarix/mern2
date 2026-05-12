import { Router } from "express";
import { authMiddleware, adminMiddleware } from "../middleware/authMiddleware.js";
import * as adminController from "../controllers/adminController.js";

const router = Router();

router.post("/login", adminController.adminLogin);
router.get("/dashboard", authMiddleware, adminMiddleware, adminController.getDashboardStats);
router.get("/orders/stats", authMiddleware, adminMiddleware, adminController.getOrderStats);
router.get("/sales/stats", authMiddleware, adminMiddleware, adminController.getSalesStats);
router.get("/products/stats", authMiddleware, adminMiddleware, adminController.getProductStats);

export default router;
