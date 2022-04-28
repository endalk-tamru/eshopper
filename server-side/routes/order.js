const express = require("express");
const Order = require("../models/order");
const {
  isAuthenticatedAndAuthorized,
  isAuthenticatedAndAdmin,
} = require("../middleware/auth");

const router = express.Router();

// @routes  GET api/order
// @desc    Get All orders
// @access  Private - Admin
router.get("/", isAuthenticatedAndAdmin, (req, res) => {
  Order.find()
    .sort({ createdAt: -1 })
    .then((order) => res.status(200).json(order))
    .catch((err) => res.status(500).json(err));
});

// @routes  GET api/order/history/:userId
// @desc    Get LoggedIn user's order history
// @access  Private - LoggedIn User
router.get("/history/:id", isAuthenticatedAndAuthorized, (req, res) => {
  Order.find({ userId: req.params.id })
    .sort({ createdAt: -1 })
    .then((order) => res.status(200).json(order))
    .catch((err) => res.status(500).json(err));
});

// @routes  GET api/order/income
// @desc    Get income statistics per year/month/week
// @access  Private - Admin
router.get("/income", isAuthenticatedAndAdmin, async (req, res) => {
  const date = new Date();
  const currentYear = new Date(date.getFullYear(), 0, 1);
  const lastYear = new Date(date.getFullYear() - 1, 0, 1);
  const currentMonth = new Date(date.getFullYear(), date.getMonth(), 1);

  try {
    const yearlyStats = await Order.aggregate([
      { $match: { createdAt: { $gte: lastYear } } },
      {
        $project: {
          year: { $year: "$createdAt" },
          sales: "$productTotalAmount",
        },
      },
      {
        $group: {
          _id: "$year",
          total: { $sum: "$sales" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const monthlyStats = await Order.aggregate([
      { $match: { createdAt: { $gte: currentYear } } },
      {
        $project: {
          month: { $month: "$createdAt" },
          sales: "$productTotalAmount",
        },
      },
      {
        $group: {
          _id: "$month",
          total: { $sum: "$sales" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const weeklyStats = await Order.aggregate([
      { $match: { createdAt: { $gte: currentMonth } } },
      {
        $project: {
          week: { $isoWeek: "$createdAt" },
          sales: "$productTotalAmount",
        },
      },
      {
        $group: {
          _id: "$week",
          total: { $sum: "$sales" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.status(200).json({ yearlyStats, monthlyStats, weeklyStats });
  } catch (err) {
    res.status(500).json(err);
  }
});

// @routes  GET api/order/sold
// @desc    Get how many products sold statistics per year/month/week
// @access  Private - Admin
router.get("/sold", isAuthenticatedAndAdmin, async (req, res) => {
  const date = new Date();
  const currentYear = new Date(date.getFullYear(), 0, 1);
  const lastYear = new Date(date.getFullYear() - 1, 0, 1);
  const currentMonth = new Date(date.getFullYear(), date.getMonth(), 1);

  try {
    const yearlyStats = await Order.aggregate([
      { $match: { createdAt: { $gte: lastYear } } },
      {
        $project: {
          year: { $year: "$createdAt" },
          productSold: "$quantity",
        },
      },
      {
        $group: {
          _id: "$year",
          total: { $sum: "$productSold" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const monthlyStats = await Order.aggregate([
      { $match: { createdAt: { $gte: currentYear } } },
      {
        $project: {
          month: { $month: "$createdAt" },
          productSold: "$quantity",
        },
      },
      {
        $group: {
          _id: "$month",
          total: { $sum: "$productSold" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const weeklyStats = await Order.aggregate([
      { $match: { createdAt: { $gte: currentMonth } } },
      {
        $project: {
          week: { $isoWeek: "$createdAt" },
          productSold: "$quantity",
        },
      },
      {
        $group: {
          _id: "$week",
          total: { $sum: "$productSold" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.status(200).json({ yearlyStats, monthlyStats, weeklyStats });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
