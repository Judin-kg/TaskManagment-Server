const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Staff = require('../models/User');

// Helper: Generate JWT Token
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET || 'mysecretkey', {
    expiresIn: '7d',
  });
};






// ==========================
// @desc    Register new user
// @route   POST /api/auth/signup
// ==========================








exports.signup = async (req, res) => {
  try {
    const { name, email,assistantManager, contactNumber, password } = req.body;
    console.log(Staff);
    
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const existingUser = await Staff.findOne({ email });
    console.log(existingUser);
    
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // const hashedPassword = await bcrypt.hash(password, 10);

    const user = await Staff.create({
      name,
      assistantManager,
      contactNumber,
      email,
      password,
      role: "staff",
    });

    const token = generateToken(user._id);

    return res.status(201).json({
      success: true,
      message: 'Signup successful 🎉',
      token,
      user: {
        id: user._id,
        name: user.name,
        assistantManager: user.assistantManager,
      contactNumber:user.contactNumber,
        email: user.email,
        role: user.role,
        status: user.status,
      },
    });
  } catch (err) {
    console.error('Signup Error:', err);
    res.status(500).json({ message: 'Server error during signup' });
  }
};



// ==========================
// @desc    Login user/admin
// @route   POST /api/auth/login
// ==========================

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
console.log('Login Request:', req.body);


    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await Staff.findOne({ email });
    console.log("user details:",user);
    if (!user) {
      console.log('User not found');
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    if (user.status === 'blocked') {
       console.log('Password mismatch');
      return res.status(403).json({ message: 'Your account has been blocked by admin.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    console.log(password,"passward");
    console.log(user.password,"db");
    
    console.log(isMatch,"ismatch");
    
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const token = generateToken(user._id);

    res.status(200).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
      },
    });
  } catch (err) {
    console.error('Login Error:', err);
    res.status(500).json({ message: 'Server error during login' });
  }
};




exports.loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
     console.log(password,"admin passwarddddddddd");
     
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await Staff.findOne({ email });
   log("user detailsssssssssss:",user);
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admins only.' });
    }

    if (user.status === 'blocked') {
      return res.status(403).json({ message: 'Admin account has been blocked.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET || 'mysecretkey', {
      expiresIn: '7d',
    });

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
    console.error('Admin Login Error:', err);
    res.status(500).json({ message: 'Server error during admin login' });
  }
};






// Get all staff
// exports.getAllStaff = async (req, res) => {
//   try {
//     const staff = await Staff.find({ role: "staff" })
//       .populate("assistantManager", "name email contactNumber role")
//       .select("name email contactNumber role assistantManager status");

//     console.log("Fetched staff list:", staff);

//     res.status(200).json(staff);
//   } catch (err) {
//     console.error("Error fetching staff:", err);
//     res.status(500).json({ message: "Error fetching staff", error: err.message });
//   }
// };

exports.getAllStaff = async (req, res) => {
  try {
    const staff = await Staff.find({ role: "staff" })
      .populate("assistantManager", "name email contactNumber role")
      .select("name email contactNumber role assistantManager status password"); // ✅ Include password

    console.log("Fetched staff list with password:", staff);

    res.status(200).json(staff);
  } catch (err) {
    console.error("Error fetching staff:", err);
    res.status(500).json({ message: "Error fetching staff", error: err.message });
  }
};

// ✅ Delete Staff
exports.deleteStaff = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedStaff = await Staff.findByIdAndDelete(id);
    if (!deletedStaff) {
      return res.status(404).json({ message: "Staff member not found" });
    }

    res.status(200).json({ message: "Staff member deleted successfully" });
  } catch (err) {
    console.error("Error deleting staff:", err);
    res.status(500).json({ message: "Error deleting staff" });
  }
};

