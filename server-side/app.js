const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv").config();
const cors = require("cors");

const app = express();

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then((conn) => console.log(`MongoDB Connected: ${conn.connection.host}`))
  .catch((err) => console.log(err));

// Express Middleware
app.use(cors());
app.use(
  express.json({ verify: (req, res, buffer) => (req["rawBody"] = buffer) })
);

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/user", require("./routes/user"));
app.use("/api/product", require("./routes/product"));
app.use("/api/review", require("./routes/review"));
app.use("/api/cart", require("./routes/cart"));
app.use("/api/order", require("./routes/order"));
app.use("/api/contact", require("./routes/contact"));
app.use("/api/create-checkout-session", require("./routes/checkout"));
app.use("/api/webhook", require("./routes/webhook"));

// Serve server-side
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../client-side/build")));

  app.get("*", (req, res) =>
    res.sendFile(
      path.resolve(__dirname, "../", "client-side", "build", "index.html")
    )
  );
} else {
  app.get("/", (req, res) => res.send("Please set to production"));
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server is running on PORT ${PORT}`));
