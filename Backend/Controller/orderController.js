import mongoose from "mongoose";
import Order from "../Model/orderModel.js";
import Product from "../Model/productModel.js";

export const createOrder = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { items } = req.body;

    // 1. Loop through each item and reduce stock
    for (const item of items) {
      const product = await Product.findById(item._id).session(session); // Using _id based on your request body

      if (!product) {
        throw new Error(`Product not found: ${item._id}`);
      }

      if (product.stock < item.quantity) {
        throw new Error(`Not enough stock for: ${product.name}`);
      }

      product.stock -= item.quantity; // Reduce stock based on quantity
      await product.save({ session });
    }

    // 2. Create the order
    const newOrder = new Order(req.body);
    await newOrder.save({ session });

    await session.commitTransaction();
    session.endSession();

    res.status(201).json({ message: 'Order saved successfully', order: newOrder });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    console.error("Order creation error:", err.message);
    res.status(500).json({ error: err.message || 'Failed to save order' });
  }
};

// GET all orders (Admin use)
export const getOrder = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: orders });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ success: false, message: "Server error fetching orders" });
  }
};

// GET orders by user ID
export const getOrdersByUser = async (req, res) => {
  const { id } = req.params;
  try {
    const orders = await Order.find({ userId: id }).sort({ createdAt: -1 });
    res.status(200).json(orders); // Return orders as an array
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch user orders" });
  }
};
