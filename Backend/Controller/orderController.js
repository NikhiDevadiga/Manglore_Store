import mongoose from "mongoose";
import Order from "../Model/orderModel.js";
import Product from "../Model/productModel.js";

// Utility functions to handle unit conversion
function convertToBaseUnit(weight, unit) {
  switch (unit) {
    case 'kg': return weight * 1000;
    case 'g': return weight;
    case 'liter': return weight * 1000;
    case 'ml': return weight;
    case 'unit': return weight;
    default: throw new Error(`Unsupported unit: ${unit}`);
  }
}

function convertFromBaseUnit(baseWeight, targetUnit) {
  switch (targetUnit) {
    case 'kg': return baseWeight / 1000;
    case 'g': return baseWeight;
    case 'liter': return baseWeight / 1000;
    case 'ml': return baseWeight;
    case 'unit': return baseWeight;
    default: throw new Error(`Unsupported unit: ${targetUnit}`);
  }
}

export const createOrder = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { items } = req.body;

    for (const item of items) {
      const product = await Product.findById(item._id).session(session);
      if (!product) {
        throw new Error(`Product not found: ${item._id}`);
      }

      const productStockBase = convertToBaseUnit(product.stockquantity, product.stockunit);
      const orderedQtyBase = convertToBaseUnit(item.weight, item.unit) * item.quantity;
// unit from request

      if (orderedQtyBase > productStockBase) {
        throw new Error(`Not enough stock for: ${product.name}`);
      }

      const updatedStockBase = productStockBase - orderedQtyBase;
      product.stockquantity = convertFromBaseUnit(updatedStockBase, product.stockunit);

      await product.save({ session });
    }

    const newOrder = new Order(req.body);
    await newOrder.save({ session 

      
    });

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
