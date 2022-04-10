const express = require("express");
const stripe = require("stripe")(process.env.STRIPE_PRIVATE_KEY);
const endpointSecret = process.env.STRIPE_WEB_HOOK_SECRET;
const Order = require("../models/order");

const router = express.Router();

// @routes  POST api/webhook
// @desc    Listen for events on Stripe account when a customer make payment
// @access  Private - Stripe Webhook
router.post("/", async (req, res) => {
  const sig = req.headers["stripe-signature"];

  let event;

  try {
    event = stripe.webhooks.constructEvent(req["rawBody"], sig, endpointSecret);
  } catch (err) {
    console.log(`Webhook Error: ${err.message}`);
    res.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const { line_items } = await stripe.checkout.sessions.retrieve(session.id, {
      expand: ["line_items"],
    });

    const data = line_items.data.map((item) => {
      return {
        customerId: session.customer,
        customerName: session.customer_details.name,
        customerEmail: session.customer_details.email,
        address: session.customer_details.address.country,
        productName: item.description,
        productTotalAmount: (item.amount_total / 100).toFixed(2),
        quantity: item.quantity,
      };
    });

    // Saving in to order database after a successful payment
    Order.insertMany(data)
      .then(() => console.log("Order Saved"))
      .catch((err) => console.log(err));

    // Remove all user's cart from cart db after adding it in to order
    Cart.findOneAndDelete({ userId: session.client_reference_id })
      .then(() => console.log("Removed from Cart"))
      .catch((err) => console.log(err));
  }

  res.status(200).json();
});

module.exports = router;
