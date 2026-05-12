import { Router } from "express";
import { authMiddleware, adminMiddleware } from "../middleware/authMiddleware.js";
import * as orderController from "../controllers/orderController.js";

const router = Router();

router.post("/", authMiddleware, orderController.createOrder);
router.get("/", authMiddleware, orderController.getOrders);
router.get("/admin/all", authMiddleware, adminMiddleware, orderController.getAllOrders);
router.get("/:id", authMiddleware, orderController.getOrderById);
router.put("/:id/status", authMiddleware, adminMiddleware, orderController.updateOrderStatus);
router.put("/:id/cancel", authMiddleware, orderController.cancelOrder);
router.delete("/:id", authMiddleware, adminMiddleware, orderController.deleteOrder);

export default router;
