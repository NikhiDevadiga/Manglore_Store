import mongoose from "mongoose";

const addressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  house: { type: String, required: true },
  area: { type: String, required: true },
  landmark: { type: String },
}, { timestamps: true });

const Address = mongoose.model("Address", addressSchema);
export default Address;