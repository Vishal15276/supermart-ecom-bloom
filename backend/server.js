import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import multer from "multer";
import path from "path";
import fs from "fs";
import { OAuth2Client } from "google-auth-library";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;
const JWT_SECRET = process.env.JWT_SECRET;
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const client = new OAuth2Client(GOOGLE_CLIENT_ID);

// ====== DB CONNECTION ======
mongoose.connect(MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error("❌ MongoDB error:", err.message));

// ====== SCHEMAS ======
const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, default: "user" }
});

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  stock: { type: Number, required: true },
  image: { type: String, required: true }
});

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  products: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    quantity: { type: Number, required: true, min: 1 }
  }],
  totalAmount: { type: Number, required: true, min: 0 },
  shippingDetails: {
    fullName: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    zip: { type: String, required: true }
  },
  paymentDetails: {
    cardNumber: String,
    expiry: String,
    cvv: String
  },
  status: { type: String, default: "pending", enum: ["pending", "processing", "shipped", "delivered", "cancelled","accepted","rejected"] }
}, { timestamps: true });

const User = mongoose.model("User", userSchema);
const Product = mongoose.model("Product", productSchema);
const Order = mongoose.model("Order", orderSchema);

// ====== HELPERS ======
const generateToken = user => jwt.sign(
  { id: user._id, email: user.email, role: user.role },
  JWT_SECRET,
  { expiresIn: "7d" }
);

const authenticateToken = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Access denied. No token." });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: "Invalid or expired token." });
    req.user = user;
    next();
  });
};

const isAdmin = (req, res, next) => {
  if (req.user.role !== "admin") return res.status(403).json({ message: "Admin access only." });
  next();
};

// ====== MULTER SETUP ======
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname)
});
const upload = multer({ storage });

// ====== AUTH ROUTES ======
app.post("/api/register", async (req, res) => {
  const { name, email, password, role = "user" } = req.body;
  try {
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: "User already exists." });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashed, role });
    const token = generateToken(user);

    res.status(201).json({
      message: "Registration successful.",
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    });
  } catch (err) {
    res.status(500).json({ message: "Registration error.", error: err.message });
  }
});

app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "Invalid credentials." });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: "Invalid credentials." });

    const token = generateToken(user);
    res.status(200).json({
      message: "Login successful.",
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    });
  } catch (err) {
    res.status(500).json({ message: "Login error.", error: err.message });
  }
});

app.post("/api/google-login", async (req, res) => {
  const { credential } = req.body;
  try {
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: GOOGLE_CLIENT_ID
    });
    const { email, name } = ticket.getPayload();
    let user = await User.findOne({ email });

    if (!user) user = await User.create({ name, email, password: "", role: "user" });

    const token = generateToken(user);
    res.status(200).json({
      message: "Google login successful.",
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    });
  } catch (err) {
    res.status(401).json({ message: "Google login failed.", error: err.message });
  }
});

// ====== PRODUCT ROUTES ======
app.get("/api/products", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: "Error fetching products.", error: err.message });
  }
});

app.get("/api/products/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found." });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: "Error fetching product.", error: err.message });
  }
});

app.post("/api/products", authenticateToken, isAdmin, upload.single("image"), async (req, res) => {
  try {
    const { name, category, price, stock } = req.body;
    const image = req.file?.filename;
    if (!name || !category || !price || !stock || !image)
      return res.status(400).json({ message: "All fields are required." });

    const product = await Product.create({ name, category, price, stock, image });
    res.status(201).json({ message: "Product created.", product });
  } catch (err) {
    res.status(500).json({ message: "Create error.", error: err.message });
  }
});

app.put("/api/products/:id", authenticateToken, isAdmin, upload.single("image"), async (req, res) => {
  try {
    const { name, category, price, stock } = req.body;
    const updateData = { name, category, price, stock };

    if (req.file) {
      updateData.image = req.file.filename;
      const oldProduct = await Product.findById(req.params.id);
      if (oldProduct?.image) {
        const oldImagePath = `uploads/${oldProduct.image}`;
        if (fs.existsSync(oldImagePath)) fs.unlink(oldImagePath, err => err && console.error(err));
      }
    }

    const updated = await Product.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!updated) return res.status(404).json({ message: "Product not found." });
    res.json({ message: "Product updated.", product: updated });
  } catch (err) {
    res.status(500).json({ message: "Update error.", error: err.message });
  }
});

app.delete("/api/products/:id", authenticateToken, isAdmin, async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found." });

    if (product.image) {
      const imgPath = `uploads/${product.image}`;
      if (fs.existsSync(imgPath)) fs.unlink(imgPath, err => err && console.error(err));
    }

    res.json({ message: "Product deleted." });
  } catch (err) {
    res.status(500).json({ message: "Delete error.", error: err.message });
  }
});

// ====== ORDER ROUTES ======
app.post("/api/orders", authenticateToken, async (req, res) => {
  try {
    const { products, totalAmount, shippingDetails, paymentDetails } = req.body;
    const order = await Order.create({
      user: req.user.id,
      products,
      totalAmount,
      shippingDetails,
      paymentDetails
    });
    res.status(201).json({ message: "Order placed.", order });
  } catch (err) {
    res.status(500).json({ message: "Order error.", error: err.message });
  }
});

app.get("/api/orders", authenticateToken, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id }).populate("products.product");
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: "Order fetch error.", error: err.message });
  }
});

// PATCH order status (admin only)
app.put("/api/admin/orders/:orderId/status", authenticateToken, isAdmin, async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    // Validate status against allowed enum values
    const allowedStatuses = Order.schema.path('status').enumValues;
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status value." });
    }

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: "Order not found." });

    order.status = status;
    await order.save();

    res.json({ message: `Order status updated to ${status}.`, order });
  } catch (err) {
    res.status(500).json({ message: "Error updating order status.", error: err.message });
  }
});



// Get all orders (admin only)
app.get("/api/admin/orders", authenticateToken, isAdmin, async (req, res) => {
  try {
    // Populate user info and product info inside orders
    const orders = await Order.find()
      .populate("user", "name email") // populate user name & email only
      .populate("products.product", "name price category"); // populate product info

    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: "Error fetching all orders.", error: err.message });
  }
});



// ====== START SERVER ======
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
