import { Router } from "express";
import { authMiddleware, adminMiddleware } from "../middleware/authMiddleware.js";
import * as couponController from "../controllers/couponController.js";

const router = Router();

router.post("/validate", authMiddleware, couponController.validateCoupon);
router.get("/", authMiddleware, adminMiddleware, couponController.getCoupons);
router.post("/", authMiddleware, adminMiddleware, couponController.createCoupon);
router.put("/:id", authMiddleware, adminMiddleware, couponController.updateCoupon);
router.delete("/:id", authMiddleware, adminMiddleware, couponController.deleteCoupon);

export default router;
