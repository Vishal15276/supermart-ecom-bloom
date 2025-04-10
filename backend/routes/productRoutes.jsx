import express from "express";
import { getAllProducts, getProductById, createProduct } from "../controllers/productController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { adminMiddleware } from "../middleware/adminMiddleware.js";

const router = express.Router();

router.get("/", getAllProducts);
router.get("/:id", getProductById);
router.post("/", authMiddleware, adminMiddleware, createProduct);

export default router;
