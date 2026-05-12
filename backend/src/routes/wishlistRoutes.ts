import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import * as wishlistController from "../controllers/wishlistController.js";

const router = Router();

router.get("/", authMiddleware, wishlistController.getWishlist);
router.post("/add", authMiddleware, wishlistController.addToWishlist);
router.delete("/remove/:productId", authMiddleware, wishlistController.removeFromWishlist);
router.delete("/clear", authMiddleware, wishlistController.clearWishlist);

export default router;
