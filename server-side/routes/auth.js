const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv").config();
const User = require("../models/user");
const { isAuthenticated } = require("../middleware/auth");

const router = express.Router();

// @routes  POST api/auth/register
// @desc    Register new user
// @access  Public - Anyone
router.post("/register", (req, res) => {
  const { username, email, password, confirmPassword } = req.body;

  // Check if fields are empty
  if (!username || !email || !password || !confirmPassword)
    return res.status(400).json({ errMsg: "Please enter all fields" });

  // Check if passwords match
  if (password !== confirmPassword)
    return res.status(400).json({ errMsg: "Password does not match" });

  // Check if user already exists
  User.findOne({ email })
    .then((user) => {
      if (user) return res.status(400).json({ errMsg: "User already exists" });

      const newUser = new User({
        username,
        email,
        password,
      });

      //   Encrypt/Hash password
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hashedPassword) => {
          if (err) throw err;

          newUser.password = hashedPassword;
          newUser.save().then((user) => {
            //   Assign payload to the token
            const token = jwt.sign(
              { id: user.id, email: user.email, isAdmin: user.isAdmin },
              process.env.JWT_SECRET
            );
            res.status(200).json({
              token,
              user: {
                id: user.id,
                username: user.username,
                email: user.email,
                isAdmin: user.isAdmin
              },
            });
          });
        });
      });
    })
    .catch((err) => res.status(500).json(err));
});

// @routes  POST api/auth/login
// @desc    Login a user
// @access  Public - Anyone
router.post("/login", (req, res) => {
  const { email, password, loginAsAnAdmin } = req.body;  

  // Check if fields are empty
  if (!email || !password)
    return res.status(400).json({ errMsg: "Please enter all fields" });

  // Check if user does not exist
  User.findOne({ email })
    .then((user) => {
      if (!user) return res.status(400).json({ errMsg: "User does not exist" });

      // Validate password
      bcrypt.compare(password, user.password).then((isMatch) => {
        if (!isMatch)
          return res.status(400).json({ errMsg: "Invalid credentials" });

        // check if user is an admin for admin page
        if (loginAsAnAdmin && !user.isAdmin)
          return res.status(400).json({ errMsg: "You are not an Admin!" });

        //   Assign payload to the token
        const token = jwt.sign(
          { id: user.id, email: user.email, isAdmin: user.isAdmin },
          process.env.JWT_SECRET
        );

        res.status(200).json({
          token,
          user: {
            id: user.id,
            username: user.username,
            email: user.email,
            isAdmin: user.isAdmin
          },
        });
      });
    })
    .catch((err) => res.status(500).json(err));
});

// @routes  GET api/auth/user
// @desc    Get current loggedIn user data
// @access  Private - Logged in user
router.get("/user", isAuthenticated, (req, res) => {
  User.findById(req.user.id)
    .select("-password")
    .then((user) =>
      res.status(200).json({
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
        },
      })
    )
    .catch((err) => res.status(500).json(err));
});

module.exports = router;
