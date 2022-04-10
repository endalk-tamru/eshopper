const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { ObjectId } = mongoose.Schema.Types;

const productSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    desc: {
      type: String,
      required: true,
    },
    cloudinaryImgId: {
      type: String,
      required: true,
    },
    imgUrl: {
      type: String,
      required: true,
    },
    size: {
      type: Array,
    },
    color: {
      type: Array,
    },
    category: {
      type: Array,      
    },
    price: {
      type: Number,
      required: true,
    },    
    inStock: {
      type: Boolean,
      default: true
    },
    postedBy: {
      type: ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

productSchema.index(
  {
    title: "text",
    desc: "text",
  },
  {
    weight: {
      title: 5,
      desc: 1,
    },
  }
);

module.exports = Product = mongoose.model("Product", productSchema);
