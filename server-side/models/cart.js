const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { ObjectId } = mongoose.Schema.Types;

const cartSchema = new Schema(
  {
    userId: {
      type: ObjectId,
      ref: "User",
    },
    products: [
      {
        productId: {
          type: ObjectId,
          ref: "Product",
        },
        size: {
          type: String,
          required: true
        },
        color: {
          type: String,
          required: true
        },        
        quantity: {
          type: Number,
          default: 1,
        },
        totalPrice: {
          type: Number,
          required: true
        }
      },
    ],
    subTotal: {
      type: Number,      
      default: 0
    }
  },
  { timestamps: true }
);

module.exports = Cart = mongoose.model("Cart", cartSchema);
