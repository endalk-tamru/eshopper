const express = require("express");
const User = require("../models/user");
const { isAuthenticatedAndAdmin } = require("../middleware/auth");

const router = express.Router();

// @routes  PUT api/user/:id
// @desc    User/Admin update user data
// @access  Private - Admin
router.put("/:id", isAuthenticatedAndAdmin, async (req, res) => {
  User.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true })
    .select("-password")
    .then((updatedUser) => {
      res.status(200).json(updatedUser);
    })
    .catch((err) => res.status(500).json(err));
});

// @routes  DELETE api/user/:id
// @desc    Admin delete user data
// @access  Private - Admin
router.delete("/:id", isAuthenticatedAndAdmin, (req, res) => {
  User.findByIdAndDelete(req.params.id)
    .then(() => res.status(200).json({ id: req.params.id }))
    .catch((err) => res.status(500).json(err));
});

// @routes  GET api/user
// @desc    Admin can get All user
// @access  Private - Admin
router.get("/", isAuthenticatedAndAdmin, (req, res) => {
  const date = new Date();
  const past48Hr = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate() - 2
  );

  const users = req.query.newUsers
    ? User.find({ createdAt: { $gte: past48Hr } })
    : User.find();
  users
    .select("-password")
    .sort({ createdAt: -1 })
    .then((users) => res.status(200).json(users))
    .catch((err) => res.status(500).json(err));
});

// @routes  GET api/user/stats
// @desc    Get how many users are registered with in a year/month/week
// @access  Private - Admin
router.get("/stats", isAuthenticatedAndAdmin, async (req, res) => {
  const date = new Date();
  const currentYear = new Date(date.getFullYear(), 0, 1);
  const lastYear = new Date(date.getFullYear() - 1, 0, 1);
  const currentMonth = new Date(date.getFullYear(), date.getMonth(), 1);

  try {
    const yearlyStats = await User.aggregate([
      { $match: { createdAt: { $gte: lastYear } } },
      {
        $project: {
          year: { $year: "$createdAt" },
        },
      },
      {
        $group: {
          _id: "$year",
          total: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const monthlyStats = await User.aggregate([
      { $match: { createdAt: { $gte: currentYear } } },
      {
        $project: {
          month: { $month: "$createdAt" },
        },
      },
      {
        $group: {
          _id: "$month",
          total: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const weeklyStats = await User.aggregate([
      { $match: { createdAt: { $gte: currentMonth } } },
      {
        $project: {
          week: { $isoWeek: "$createdAt" },
        },
      },
      {
        $group: {
          _id: "$week",
          total: { $sum: 1 },
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
