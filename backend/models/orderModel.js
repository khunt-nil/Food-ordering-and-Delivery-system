import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  street: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  pincode: { type: String, required: true },
  country: { type: String, required: true },
  phone: { type: String, required: true },

  items: [
    {
      foodId: { type: mongoose.Schema.Types.ObjectId, ref: "food", required: true },
      name: { type: String, required: true },
      price: { type: Number, required: true },
      quantity: { type: Number, required: true },
    }
  ],

  totalAmount: { type: Number, required: true },
  status: { type: String, enum: ["Pending", "Processing", "Delivered"], default: "Pending" },
  payment: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

const orderModel = mongoose.models.Order || mongoose.model("Order", orderSchema);
export default orderModel;
