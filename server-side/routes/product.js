const express = require("express");
const Product = require("../models/product");
const upload = require("../utils/multer");
const { cloudinary } = require("../utils/cloudinary");
const { isAuthenticatedAndAdmin } = require("../middleware/auth");

const router = express.Router();

// @routes  GET api/product
// @desc    GET products by category || by searching || all
// @access  Public
router.get("/", (req, res) => {
  let inStock = req.query.inStock;
  let byCategory = req.query.category;
  let bySearching = req.query.search;
  let byColor = req.query.color;
  let bySize = req.query.size;
  let minPrice = req.query.minPrice;
  let maxPrice = req.query.maxPrice;

  let pageNum = parseInt(req.query.pageNum) - 1 || 0;
  let limitNum = parseInt(req.query.limitNum) || 12;

  let products;

  // fetch All products if all queries are Empty
  if (!byCategory && !bySearching && !minPrice && !byColor && !bySize) {
    products = inStock ? Product.find({ inStock }) : Product.find();
  }

  // fetch products by Category only
  if (byCategory && !bySearching && !minPrice && !byColor && !bySize) {
    products = Product.find({ inStock, category: { $in: byCategory } });
  }

  // fetch products by Searching only
  if (bySearching && !byCategory && !minPrice && !byColor && !bySize) {
    products = Product.find({ inStock, $text: { $search: bySearching } });
  }

  // filter All products by Price OR Color OR Size
  if ((byColor || bySize || minPrice) && !byCategory && !bySearching) {
    products = Product.find({
      inStock,
      $or: [
        {
          $and: [{ price: { $gte: minPrice } }, { price: { $lte: maxPrice } }],
        },
        { color: { $in: byColor } },
        { size: { $in: bySize } },
      ],
    });
  }

  // filter products by Price based on selected Category
  if (byCategory && minPrice && !bySearching && !byColor && !bySize) {
    products = Product.find({
      inStock,
      $and: [
        { category: { $in: byCategory } },
        {
          $and: [{ price: { $gte: minPrice } }, { price: { $lte: maxPrice } }],
        },
      ],
    });
  }

  // filter products by Color based on selected Category
  if (byCategory && byColor && !bySearching && !minPrice && !bySize) {
    products = Product.find({
      inStock,
      $and: [{ category: { $in: byCategory } }, { color: { $in: byColor } }],
    });
  }

  // filter products by Size based on selected Category
  if (byCategory && bySize && !bySearching && !minPrice && !byColor) {
    products = Product.find({
      inStock,
      $and: [{ category: { $in: byCategory } }, { size: { $in: bySize } }],
    });
  }

  // filter products by Price AND Color AND Size based on selected Category
  if (byCategory && minPrice && byColor && bySize && !bySearching) {
    products = Product.find({
      inStock,
      $and: [
        { category: { $in: byCategory } },
        { color: { $in: byColor } },
        { size: { $in: bySize } },
        {
          $and: [{ price: { $gte: minPrice } }, { price: { $lte: maxPrice } }],
        },
      ],
    });
  }

  // filter products by Price based on Search
  if (bySearching && minPrice && !byColor && !byCategory && !bySize) {
    products = Product.find({
      inStock,
      $and: [
        { $text: { $search: bySearching } },
        {
          $and: [{ price: { $gte: minPrice } }, { price: { $lte: maxPrice } }],
        },
      ],
    });
  }

  // filter products by Color based on Search
  if (bySearching && byColor && !byCategory && !minPrice && !bySize) {
    products = Product.find({
      inStock,
      $and: [{ $text: { $search: bySearching } }, { color: { $in: byColor } }],
    });
  }

  // filter products by Size based on Search
  if (bySearching && bySize && !byCategory && !minPrice && !byColor) {
    products = Product.find({
      inStock,
      $and: [{ $text: { $search: bySearching } }, { size: { $in: bySize } }],
    });
  }

  // filter products by Price AND Color AND Size based on Search
  if (bySearching && minPrice && byColor && bySize && !byCategory) {
    products = Product.find({
      inStock,
      $and: [
        { $text: { $search: bySearching } },
        { color: { $in: byColor } },
        { size: { $in: bySize } },
        {
          $and: [{ price: { $gte: minPrice } }, { price: { $lte: maxPrice } }],
        },
      ],
    });
  }

  products
    .sort({ createdAt: -1 })
    .skip(pageNum * limitNum)
    .limit(limitNum)
    .then((product) => res.status(200).json(product))
    .catch((err) => res.status(500).json(err));
});

// @routes  GET api/product/category-stats
// @desc    Get number of products based on category
// @access  Public
router.get("/category-stats", (req, res) => {
  Product.aggregate([
    { $match: { inStock: true } },
    { $unwind: "$category" },
    { $group: { _id: "$category", total: { $sum: 1 } } },
  ])
    .then((categoryStat) => res.status(200).json(categoryStat))
    .catch((err) => res.status(500).json(err));
});

// @routes  GET api/product/:id
// @desc    GET single product detail
// @access  Public
router.get("/:id", (req, res) => {
  Product.findById(req.params.id)
    .then((product) => res.status(200).json(product))
    .catch((err) => res.status(500).json({ msg: "Can not find the product" }));
});

// @routes  POST api/product
// @desc    Admin can create product
// @access  Private - Admin
router.post(
  "/create-product",
  isAuthenticatedAndAdmin,
  upload.single("productImg"),
  async (req, res) => {
    const { title, desc, size, color, price, category } = req.body;

    // console.log(req.file);

    // Check if fields are empty
    if (!title || !desc || !size || !color || !price || !category)
      return res.status(400).json({ errMsg: "Please enter all fields" });

    try {
      // Uploading image to cloudinary
      const uploadedResponse = await cloudinary.uploader.upload(req.file.path, {
        upload_preset: "eshopper",
      });

      // saving in to a db
      const newProduct = new Product({
        title,
        desc,
        cloudinaryImgId: uploadedResponse.public_id,
        imgUrl: uploadedResponse.secure_url,
        size: size.split(","),
        color: color.split(","),
        price,
        category: category.split(","),
        postedBy: req.user.id,
      });

      await newProduct.save();
      res.status(200).json(newProduct);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  }
);

// @routes  PUT api/product
// @desc    Admin can edit product
// @access  Private - Admin
router.put("/:id", isAuthenticatedAndAdmin, (req, res) => {
  const { title, desc, size, color, price, category } = req.body;

  if (
    !title ||
    !desc ||
    !price ||
    size.length <= 0 ||
    color.length <= 0 ||
    category.length < 0
  )
    return res.status(400).json({ errMsg: "Please enter all fields" });

  Product.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true })
    .then((updatedProduct) => res.status(200).json(updatedProduct))

    .catch((err) => res.status(500).json(err));
});

// @routes  DELETE api/product/:id
// @desc    Admin can Delete product
// @access  Private - Admin
router.delete("/:id", isAuthenticatedAndAdmin, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    // Delete img from cloudinary
    await cloudinary.uploader.destroy(product.cloudinaryImgId);
    // Delete product from db
    await product.remove();
    res.status(200).json({ id: req.params.id }); 
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
