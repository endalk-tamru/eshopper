const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const orderSchema = new Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    stripeCustomerId: {
      type: String,
      required: true,
    },
    customerName: {
      type: String,
      required: true,
    },
    customerEmail: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    productName: {
      type: String,
      required: true,
    },
    productTotalAmount: {
      type: Number,
      required: true,
    },
    quantity: {
      type: Number,
      default: 1,
    },
    paymentMethod: {
      type: String,
      default: "Stripe",
    },
  },
  { timestamps: true }
);

module.exports = Order = mongoose.model("Order", orderSchema);
