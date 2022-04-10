const express = require("express");
const Cart = require("../models/cart");
const {
  isAuthenticated,
  isAuthenticatedAndAuthorized,
} = require("../middleware/auth");

const router = express.Router();

// @routes  GET api/cart/:userid
// @desc    Get user cart by userId
// @access  Private - Authorized user
router.get("/:id", isAuthenticatedAndAuthorized, (req, res) => {
  Cart.findOne({ userId: req.user.id })    
    .populate({
      path: "products",
      populate: { path: "productId", select: "_id title imgUrl price" },
    })
    .then((carts) => {
      if (!carts) {
        res.status(200).json({ products: [] });
      } else {
        res.status(200).json(carts);
      }
    })
    .catch((err) => res.status(500).json(err));
});

// @routes  POST api/cart
// @desc    Add new product in to cart
// @access  Private - Any Logged in user
router.post("/", isAuthenticated, async (req, res) => {
  const { productId, size, color, productQty, price } = req.body;
  const totalPrice =
    Math.round(
      (Number.parseFloat(productQty) * Number.parseFloat(price) +
        Number.EPSILON) *
        100
    ) / 100;

  Cart.findOne({ userId: req.user.id })
    .then((userCart) => {
      // check if user has cart before
      if (userCart) {
        const isProductExist = userCart.products.findIndex(
          (item) =>
            item.productId.toString() === productId &&
            item.color === color &&
            item.size === size
        );
        // check if user try to add same product with same color & size in the cart
        if (isProductExist > -1) {
          return res
            .status(400)
            .json({ errMsg: "Product is already exist in the cart" });
        }
        // product is not in the cart, push new product in the cart
        else {
          userCart.products.push({
            productId,
            size,
            color,
            quantity: productQty,
            totalPrice,
          });
          userCart.subTotal =
            Math.round(
              userCart.products
                .map((item) => item.totalPrice)
                .reduce((acc, next) => acc + next) * 100
            ) / 100;

          userCart
            .save()
            .then((cart) => {
              res.status(200).json({
                successMsg: "Successfully Added To Cart",
                cartInfo: cart,
              });
            })
            .catch((err) =>
              res.status(500).json({ errMsg: "Product is not added into cart" })
            );
        }
      }
      // user has no cart, create new cart
      else {
        const newCart = new Cart({
          userId: req.user.id,
          products: [
            {
              productId,
              size,
              color,
              quantity: productQty,
              totalPrice,
            },
          ],
          subTotal: totalPrice,
        })
          .save()
          .then((cart) => {
            res.status(200).json({
              successMsg: "Successfully Added To Cart",
              cartInfo: cart,
            });
          })
          .catch((err) =>
            res.status(500).json({ errMsg: "Product is not added into cart" })
          );
      }
    })
    .catch((err) => res.status(500).json(err));
});

// @routes  PUT api/cart/:userId/:cartId
// @desc    Update cart using id that found in products array
// @access  Private - Authorized user
router.put("/:id/:cartId", isAuthenticatedAndAuthorized, (req, res) => {
  const totalPrice =
    Math.round(
      (Number.parseFloat(req.body.qty) * Number.parseFloat(req.body.price) +
        Number.EPSILON) *
        100
    ) / 100;

  Cart.findOneAndUpdate(
    { "products._id": req.params.cartId },
    {
      $set: {
        "products.$.quantity": req.body.qty,
        "products.$.totalPrice": totalPrice,
      },
    },
    { new: true }
  )
    .then((userCart) => {
      userCart.subTotal =
        Math.round(
          userCart.products
            .map((item) => item.totalPrice)
            .reduce((acc, next) => acc + next) * 100
        ) / 100;

      Cart.findByIdAndUpdate(userCart.id, { $set: userCart }, { new: true })
        .populate({
          path: "products",
          populate: { path: "productId", select: "_id title imgUrl price" },
        })
        .then((updatedCart) => {
          res.status(200).json(updatedCart);
        })
        .catch((err) =>
          res.status(500).json({ errMsg: "Can not update cart product" })
        );
    })
    .catch((err) => res.status(500).json(err));
});

// @routes  DELETE api/cart/:userId/:cartId
// @desc    Delete cart using id that found in products array
// @access  Private - Authorized user
router.delete("/:id/:cartId", isAuthenticatedAndAuthorized, (req, res) => {
  Cart.findOneAndUpdate(
    { userId: req.user.id },
    { $pull: { products: { _id: req.params.cartId } } },
    { new: true }
  )
    .then((deletedCart) => {
      // if user cart is empty then delete user from cart collection
      if (deletedCart.products.length === 0) {
        Cart.findByIdAndDelete(deletedCart._id)
          .then(() => res.status(200).json({ products: [] }))
          .catch((err) => console.log(err));
      } else {
        deletedCart.subTotal =
          Math.round(
            deletedCart.products
              .map((item) => item.totalPrice)
              .reduce((acc, next) => acc + next) * 100
          ) / 100;

        Cart.findByIdAndUpdate(
          deletedCart._id,
          { $set: deletedCart },
          { new: true }
        )
          .populate({
            path: "products",
            populate: { path: "productId", select: "_id title imgUrl price" },
          })
          .then((updatedCart) => {
            res.status(200).json(updatedCart);
          })
          .catch((err) => res.status(500).json(err));
      }
    })
    .catch((err) => res.status(500).json(err));
});

module.exports = router;
