const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { ObjectId } = mongoose.Schema.Types;

const reviewSchema = new Schema(
  {
    productId: {
      type: ObjectId,
      ref: "Product",
    },
    reviews: [
      {
        userId: {
          type: ObjectId,
          ref: "User",
        },
        username: {
          type: String,
          required: true,
        },
        rating: {
          type: Number,
          required: true,
        },
        comment: {
          type: String,
        },
        date: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    totalRate: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = Review = mongoose.model("Review", reviewSchema);
