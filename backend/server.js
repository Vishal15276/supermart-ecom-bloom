import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { OAuth2Client } from "google-auth-library";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;
const JWT_SECRET = process.env.JWT_SECRET;
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;

const client = new OAuth2Client(GOOGLE_CLIENT_ID);

// Connect to MongoDB
mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB Error:", err));

// User Schema
const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, default: "user" },
});

const User = mongoose.model("User", userSchema);

// Product Schema
const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  stock: { type: Number, required: true },
  image: { type: String, required: true },
});

const Product = mongoose.model("Product", productSchema);

// Generate JWT
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: "7d" }
  );
};

// JWT Middleware
const authenticateToken = (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Access denied. No token provided." });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: "Invalid token." });
    req.user = user;
    next();
  });
};

// Register
app.post("/api/register", async (req, res) => {
  const { name, email, password, role = "user" } = req.body;

  try {
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({ name, email, password: hashedPassword, role });

    const token = generateToken(newUser);
    res.status(201).json({
      message: "User registered successfully",
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (err) {
    console.error("Registration Error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Login
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    const token = generateToken(user);
    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Google Login
app.post("/api/google-login", async (req, res) => {
  const { credential } = req.body;

  try {
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, name } = payload;

    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        name,
        email,
        password: "",
        role: "user",
      });
    }

    const token = generateToken(user);

    res.status(200).json({
      message: "Google login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Google Login Error:", error);
    res.status(401).json({ message: "Invalid Google token", error: error.message });
  }
});

// Add product (protected)
app.post("/api/products", authenticateToken, async (req, res) => {
  const { name, category, price, stock, image } = req.body;

  try {
    const newProduct = new Product({ name, category, price, stock, image });
    await newProduct.save();

    res.status(201).json({
      message: "Product added successfully",
      product: newProduct,
    });
  } catch (err) {
    console.error("Error adding product:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
