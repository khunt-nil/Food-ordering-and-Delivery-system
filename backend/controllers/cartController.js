// controllers/cartController.js
import Order from "../models/orderModel.js";

// Retrieve the active cart for the current user
export const getCart = async (req, res) => {
  try {
    const userId = req.user.id;
    // Find an order that acts as a cart (payment not yet completed)
    const cart = await Order.findOne({ userId, payment: false });
    if (!cart) {
      return res.status(404).json({ success: false, message: "Cart not found" });
    }
    res.status(200).json({ success: true, cart });
  } catch (error) {
    console.error("Error fetching cart:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Add an item to the cart or create a new cart if one doesn't exist
export const addToCart = async (req, res) => {
  try {
    const userId = req.user.id;
    // Expect an object 'item' and optionally an 'address' (required for new carts)
    const { item, address } = req.body;
    // item should have: foodId, name, price, quantity

    let cart = await Order.findOne({ userId, payment: false });
    if (!cart) {
      // Create a new cart (order) document if none exists
      cart = new Order({
        userId,
        items: [item],
        amount: item.price * item.quantity,
        address: address || {}, // Provide an address or default to an empty object
        status: "food Processing",
        payment: false,
      });
    } else {
      // If the cart exists, check if the item is already in the cart
      const existingIndex = cart.items.findIndex(
        (i) => i.foodId.toString() === item.foodId
      );
      if (existingIndex > -1) {
        // Increase the quantity if the item already exists
        cart.items[existingIndex].quantity += item.quantity;
      } else {
        // Otherwise, push the new item
        cart.items.push(item);
      }
      // Recalculate the total amount
      cart.amount = cart.items.reduce(
        (acc, curr) => acc + (curr.price * curr.quantity),
        0
      );
    }
    await cart.save();
    res.status(200).json({ success: true, cart });
  } catch (error) {
    console.error("Error adding to cart:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update the quantity of a specific cart item
export const updateCartItem = async (req, res) => {
  try {
    const userId = req.user.id;
    const { foodId, quantity } = req.body;
    let cart = await Order.findOne({ userId, payment: false });
    if (!cart) {
      return res.status(404).json({ success: false, message: "Cart not found" });
    }
    const index = cart.items.findIndex(
      (item) => item.foodId.toString() === foodId
    );
    if (index === -1) {
      return res
        .status(404)
        .json({ success: false, message: "Item not found in cart" });
    }
    cart.items[index].quantity = quantity;
    // Recalculate the total amount
    cart.amount = cart.items.reduce(
      (acc, curr) => acc + (curr.price * curr.quantity),
      0
    );
    await cart.save();
    res.status(200).json({ success: true, cart });
  } catch (error) {
    console.error("Error updating cart item:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Remove an item from the cart
export const removeFromCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { foodId } = req.body;
    let cart = await Order.findOne({ userId, payment: false });
    if (!cart) {
      return res.status(404).json({ success: false, message: "Cart not found" });
    }
    // Filter out the item that matches the foodId
    cart.items = cart.items.filter(
      (item) => item.foodId.toString() !== foodId
    );
    // Recalculate the total amount
    cart.amount = cart.items.reduce(
      (acc, curr) => acc + (curr.price * curr.quantity),
      0
    );
    await cart.save();
    res.status(200).json({ success: true, cart });
  } catch (error) {
    console.error("Error removing from cart:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
