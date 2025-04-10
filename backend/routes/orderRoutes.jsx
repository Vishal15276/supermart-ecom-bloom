import express from "express";
import { placeOrder, getUserOrders, getAllOrders } from "../controllers/orderController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { adminMiddleware } from "../middleware/adminMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, placeOrder);
router.get("/my-orders", authMiddleware, getUserOrders);
router.get("/", authMiddleware, adminMiddleware, getAllOrders);

export default router;
