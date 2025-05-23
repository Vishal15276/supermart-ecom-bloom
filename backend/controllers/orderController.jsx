import Order from "../models/orderModel.js";

export const placeOrder = async (req, res) => {
  const { products, totalAmount } = req.body;

  if (!products || !totalAmount) {
    return res.status(400).json({ message: "Missing products or totalAmount" });
  }

  try {
    const order = await Order.create({
      user: req.user.id,
      products,
      totalAmount,
    });

    res.status(201).json({ message: "Order placed", order });
  } catch (err) {
    res.status(500).json({ message: "Error placing order", error: err.message });
  }
};

export const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .populate("products.product", "name price image")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: "Error fetching user orders", error: err.message });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .populate("products.product", "name price image")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: "Error fetching all orders", error: err.message });
  }
};
