import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";

const placeOrder = async (req, res) => {
  try {
    const newOrder = new orderModel({
      userId: req.userId, // ✅ from middleware
      items: req.body.items,
      amount: req.body.amount,
      address: req.body.address,
      status: "Order Received",
      payment: false
    });

    await newOrder.save();

    await userModel.findByIdAndUpdate(req.userId, { cartData: {} }); // ✅ from middleware

    res.json({ success: true, message: "Order placed successfully", order: newOrder });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error placing order", error: error.message });
  }
};

const getAllOrders = async (req, res) => {
  try {
    const orders = await orderModel.find().sort({ date: -1 });
    res.json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch orders", error: error.message });
  }
};

const getUserOrders = async (req, res) => {
  try {
    const userId = req.userId; // ✅ from middleware
    const orders = await orderModel.find({ userId }).sort({ createdAt: -1 });
    res.json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch user orders", error: error.message });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;
    const updatedOrder = await orderModel.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    res.json({ success: true, message: "Order status updated", order: updatedOrder });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to update order", error: error.message });
  }
};

const getOrderById = async (req, res) => {
  try {
    const order = await orderModel.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }
    res.json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to get order", error: error.message });
  }
};

export {
  placeOrder,
  getAllOrders,
  updateOrderStatus,
  getOrderById,
  getUserOrders
};
