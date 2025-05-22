import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    userName: {
      type: String,
      required: true
    },
    userPhone: {
      type: String,
      required: true
    },
    paymentMode: {
      type: String,
      enum: ["Cash on Delivery", "Razorpay"],
      required: true
    },
    paymentId: {
      type: String,
      default: null
    },
    shippingAddress: {
      house: { type: String, required: true },
      area: { type: String, required: true },
      landmark: { type: String, required: true }
    },
    total: {
      type: Number,
      required: true
    },
    items: [
      {
        _id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product"
        },
        name: { type: String, required: true },
        price: { type: Number, required: true },
        weight: { type: Number, required: true },
        unit:{type: String, enum: ['kg', 'g', 'liter', 'ml', 'unit'], required: true},
        quantity:{ type:Number, required:true}
      }
    ]
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);
export default Order;
