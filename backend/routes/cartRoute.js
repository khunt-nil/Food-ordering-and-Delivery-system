// routes/cartRoute.js
import express from "express";
import authMiddleware from "../middleware/auth.js";
import {
  addToCart,
  getCart,
  updateCartItem,
  removeFromCart,
} from "../controllers/cartController.js";

const router = express.Router();

// Get the current user's cart
router.get("/", authMiddleware, getCart);

// Add an item to the cart
router.post("/add", authMiddleware, addToCart);

// Update the quantity of an item in the cart
router.put("/update", authMiddleware, updateCartItem);

// Remove an item from the cart
router.delete("/remove", authMiddleware, removeFromCart);

export default router;
