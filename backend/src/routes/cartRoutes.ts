import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import * as cartController from "../controllers/cartController.js";

const router = Router();

router.get("/", authMiddleware, cartController.getCart);
router.post("/add", authMiddleware, cartController.addToCart);
router.put("/update", authMiddleware, cartController.updateCartItem);
router.delete("/remove/:productId", authMiddleware, cartController.removeFromCart);
router.delete("/clear", authMiddleware, cartController.clearCart);

export default router;
