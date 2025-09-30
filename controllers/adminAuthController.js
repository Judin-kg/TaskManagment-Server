// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
// const Auth = require('../models/Admin');

// // Helper: Generate JWT Token
// const generateToken = (userId) => {
//   return jwt.sign({ id: userId }, process.env.JWT_SECRET || 'mysecretkey', {
//     expiresIn: '7d',
//   });
// };

// exports.adminUser = async (req, res) => {
//   try {
//     const { email, password } = req.body;
// console.log('Login Request:', req.body);


//     if (!email || !password) {
//       return res.status(400).json({ message: 'Email and password are required' });
//     }

//     const user = await Auth.findOne({ email });
//     console.log("user details:",user);
//     if (!user) {
//       console.log('User not found');
//       return res.status(400).json({ message: 'Invalid email or password' });
//     }

//     if (user.status === 'blocked') {
//        console.log('Password mismatch');
//       return res.status(403).json({ message: 'Your account has been blocked by admin.' });
//     }

//     const isMatch = await bcrypt.compare(password, user.password);
//     console.log(password,"passward");
//     console.log(user.password,"db");
    
//     console.log(isMatch,"ismatch");
    
//     if (!isMatch) {
//       return res.status(400).json({ message: 'Invalid email or password' });
//     }

//     const token = generateToken(user._id);

//     res.status(200).json({
//       token,
//       user: {
//         id: user._id,
//         username: user.username,
//         email: user.email,
//         role: user.role,
//         status: user.status,
//       },
//     });
//   } catch (err) {
//     console.error('Login Error:', err);
//     res.status(500).json({ message: 'Server error during login' });
//   }
// };

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Auth = require("../models/Admin");

// Helper: Generate JWT Token
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET || "mysecretkey", {
    expiresIn: "7d",
  });
};

exports.adminUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("Login Request:", req.body);

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await Auth.findOne({ email });
    console.log("user details:", user);

    if (!user) {
      console.log("User not found");
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // ✅ Block non-admin users
    if (user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }

    if (user.status === "blocked") {
      return res
        .status(403)
        .json({ message: "Your account has been blocked by admin." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    console.log(password, "entered password");
    console.log(user.password, "db password hash");
    console.log(isMatch, "isMatch");

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = generateToken(user._id);

    res.status(200).json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        status: user.status,
      },
    });
  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ message: "Server error during login" });
  }
};
