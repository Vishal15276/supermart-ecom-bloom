    import express from "express";
    import { placeOrder, getUserOrders, getAllOrders } from "../controllers/orderController.js";
    import { authMiddleware } from "../middleware/authMiddleware.js";
    import { adminMiddleware } from "../middleware/adminMiddleware.js";

    const router = express.Router();

    router.route("/")
    .post(authMiddleware, placeOrder)
    .get(authMiddleware, adminMiddleware, getAllOrders); 

    router.get("/my-orders", authMiddleware, getUserOrders);

    export default router;
