import express from "express";
import {
  placeOrder,
  getAllOrders,
  updateOrderStatus,
  getOrderById,
  getUserOrders
} from "../controllers/orderController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const orderRouter = express.Router();

orderRouter.post("/place", authMiddleware, placeOrder);
orderRouter.get("/all", getAllOrders);
orderRouter.put("/status", updateOrderStatus);
orderRouter.get("/user", authMiddleware, getUserOrders); // ✅ Fix route
orderRouter.get("/:id", getOrderById);

export default orderRouter;
