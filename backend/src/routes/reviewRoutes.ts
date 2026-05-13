import { Router } from "express";
import { authMiddleware, adminMiddleware } from "../middleware/authMiddleware.js";
import * as reviewController from "../controllers/reviewController.js";

const router = Router();

// Public routes
router.get("/", reviewController.getReviews);

// Protected user routes
router.get("/user", authMiddleware, reviewController.getUserReviews);
router.post("/", authMiddleware, reviewController.createReview);
router.put("/:id", authMiddleware, reviewController.updateReview);
router.delete("/:id", authMiddleware, reviewController.deleteReview);

// Admin routes
router.delete("/admin/:id", authMiddleware, adminMiddleware, reviewController.adminDeleteReview);
router.put("/:id/status", authMiddleware, adminMiddleware, reviewController.updateReviewStatus);

export default router;
