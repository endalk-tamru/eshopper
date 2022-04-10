const express = require("express");
const stripe = require("stripe")(process.env.STRIPE_PRIVATE_KEY);
const { isAuthenticatedAndAuthorized } = require("../middleware/auth");

const router = express.Router();

// @routes  POST api/create-checkout-session/:userId
// @desc    Create checkout session & Redirect to stripe for payment
// @access  Private - Admin
router.post("/:id", isAuthenticatedAndAuthorized, async (req, res) => {
  const { products } = req.body;

  if (products.length < 0) {
    return res.status(400).json({ errMsg: "Product cart is empty" });
  }

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      client_reference_id: req.user.id,
      customer_email: req.user.email,
      line_items: products.map((item) => {
        // get product price from DB because a user may try to change the price (e.g. $10.00 -> $0.00)
        // in the frontend and get a product without paying
        // const product = await Product.find({ _id: item.productId._id });
        return {
          price_data: {
            currency: "usd",
            product_data: {
              name: item.productId.title,
              images: [item.productId.imgUrl],
            },
            unit_amount: Math.round(item.productId.price * 100),
          },
          quantity: item.quantity,
        };
      }),
      success_url: `${process.env.CLIENT_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/`,
    });
    res.status(200).json({ url: session.url });
  } catch (err) {
    console.log(err);
    res.status(500).json({ errMsg: err.raw.message });
  }
});

module.exports = router;
