import Order from "../models/Order.js";

export const placeOrder = async (req, res) => {
  const { items, totalAmount, shippingAddress } = req.body;
  const order = new Order({
    userId: req.user.id,
    items,
    totalAmount,
    shippingAddress,
  });
  await order.save();
  res.status(201).json(order);
};

export const getUserOrders = async (req, res) => {
  const orders = await Order.find({ userId: req.user.id }).populate("items.productId");
  res.json(orders);
};

export const getAllOrders = async (req, res) => {
  const orders = await Order.find().populate("items.productId").populate("userId", "name email");
  res.json(orders);
};
