const dotenv = require("dotenv").config();
const jwt = require("jsonwebtoken");

const isAuthenticated = (req, res, next) => {
  const token = req.header("x-auth-token");    
  
  // Check for token
  if (!token) return res.status(401).json({ errMsg: "No token, You are not authenticated" });

  // Verify token
  jwt.verify(token, process.env.JWT_SECRET, (err, decodedUser) => {
    if (err) return res.status(403).json({ errMsg: "Token is not valid" });

    req.user = decodedUser;    
    next();
  });
};

const isAuthenticatedAndAuthorized = (req, res, next) => {    
  isAuthenticated(req, res, () => {    
    // Only current loggedIn user is allowed to make changes about his/her own data
    if (req.user.id === req.params.id) {
      next();
    } else {
      res.status(403).json({ errMsg: "You are not Authorized to do this" });
    }
  });
};

const isAuthenticatedAndAdmin = (req, res, next) => {
  isAuthenticated(req, res, () => {
    // Only Admin is allowed to make changes
    if (req.user.isAdmin) {
      next();
    } else {
      res.status(403).json({ errMsg: "You are not Admin" });
    }
  });
};

module.exports = {
  isAuthenticated,
  isAuthenticatedAndAuthorized,
  isAuthenticatedAndAdmin,
};
