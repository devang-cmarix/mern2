import { Router } from "express";
import { authMiddleware, adminMiddleware } from "../middleware/authMiddleware.js";
import * as productController from "../controllers/productController.js";

const router = Router();

router.get("/", productController.getProducts);
router.get("/search/:query", productController.searchProducts);
router.get("/category/:category", productController.getProductsByCategory);
router.get("/:id", productController.getProductById);
router.post("/", authMiddleware, adminMiddleware, productController.createProduct);
router.put("/:id", authMiddleware, adminMiddleware, productController.updateProduct);
router.delete("/:id", authMiddleware, adminMiddleware, productController.deleteProduct);

export default router;
