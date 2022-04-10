const express = require("express");
const Contact = require("../models/contact");
const { isAuthenticatedAndAdmin } = require("../middleware/auth");

const router = express.Router();

// @routes  GET api/contact
// @desc    Get all messages
// @access  Private - Admin
router.get("/", isAuthenticatedAndAdmin, (req, res) => {
  Contact.find()
    .sort({ createdAt: -1 })
    .then((messages) => res.status(200).json(messages))
    .catch((err) => res.status(500).json(err))    
});

// @routes  POST api/contact
// @desc    Write message to system admin
// @access  Public
router.post("/", (req, res) => {
  const { username, email, subject, message } = req.body;

  if (!username || !email || !subject || !message)
    return res.status(400).json({ errMsg: "Please enter all fields" });

  const newContact = new Contact({
    username,
    email,
    subject,
    message,
  })
    .save()
    .then(() => res.status(200).json({ successMsg: "Message sent" }))
    .catch((err) => res.status(500).json({ errMsg: "Message not sent" }));
});

// @routes  PUT api/contact
// @desc    Convert unseen messages to seen message
// @access  Private - Admin
router.put("/", isAuthenticatedAndAdmin, (req, res) => {
  Contact.updateMany(
    { isSeen: false },
    { $set: { isSeen: true } },
    { new: true }
  )
    .sort({ createdAt: -1 })
    .then((messages) => res.status(200).json(messages))
    .catch((err) => res.status(500).json(err));
});

// @routes  GET api/contact
// @desc    Get unseen messages number
// @access  Private - Admin
router.get("/count", isAuthenticatedAndAdmin, (req, res) => {
  Contact.count({ isSeen: false })
    .then((unSeenMsg) => res.status(200).json(unSeenMsg))
    .catch((err) => res.status(500).json(err));
});

module.exports = router;
