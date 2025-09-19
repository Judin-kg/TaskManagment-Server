// const Staff = require("../models/User");

// exports.createAssistantManager = async (req, res) => {
//   try {
//     const { name, email, password, contactNumber, managerId } = req.body;
//     const newAM = new Staff({
//       name,
//       email,
//       password,
//       contactNumber,
//       role: "assistant_manager",
//       managerId,
//     });
//     await newAM.save();
//     res.status(201).json(newAM);
//   } catch (err) {
//     console.error("Error creating assistant manager:", err);
//     res.status(500).json({ error: "Failed to create assistant manager" });
//   }
// };

// exports.getAssistantManagers = async (req, res) => {
//   try {
//     const assistants = await AssistantManager.find().populate("managerId", "name email");
//     res.json(assistants);
//   } catch (err) {
//     console.error("Error fetching assistant managers:", err);
//     res.status(500).json({ error: "Failed to fetch assistant managers" });
//   }
// };




// const Staff = require("../models/User");

// // ✅ Create Assistant Manager
// exports.createAssistantManager = async (req, res) => {
//   try {
//     const { name, email, password, contactNumber, managerId } = req.body;

//     // ✅ Create Assistant Manager in Staff collection
//     const newAM = new Staff({
//       name,
//       email,
//       password,
//       contactNumber,
//       role: "assistant_manager",
//       managerId, // reference to manager
//     });

//     await newAM.save();
//     res.status(201).json(newAM);
//   } catch (err) {
//     console.error("Error creating assistant manager:", err);
//     res.status(500).json({ error: "Failed to create assistant manager" });
//   }
// };

// // ✅ Get All Assistant Managers
// exports.getAssistantManagers = async (req, res) => {
//   try {
//     // ✅ Fetch staff where role = assistant_manager
//     const assistants = await Staff.find({ role: "assistant_manager" })
//       .populate("managerId", "name email"); // populate manager info

//     res.json(assistants);
//   } catch (err) {
//     console.error("Error fetching assistant managers:", err);
//     res.status(500).json({ error: "Failed to fetch assistant managers" });
//   }
// };



const Staff = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
// const generateToken = (id) => {
//   return jwt.sign({ id, role: "assistant_manager" }, process.env.JWT_SECRET || "mysecretkey", {
//     expiresIn: "7d",
//   });
// };

// ✅ Login Assistant Manager
exports.loginAssistantManager = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1️⃣ Validate input
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    // 2️⃣ Find assistant manager
    const assistantManager = await Staff.findOne({ email });

    if (!assistantManager || assistantManager.role !== "assistant_manager") {
      return res.status(403).json({ message: "Access denied. Assistant Managers only." });
    }

    // 3️⃣ Check if blocked
    if (assistantManager.status === "blocked") {
      return res.status(403).json({ message: "Assistant Manager account has been blocked." });
    }

    // 4️⃣ Validate password
    const isMatch = await bcrypt.compare(password, assistantManager.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // 5️⃣ Generate token
    const token = jwt.sign(
      { id: assistantManager._id, role: assistantManager.role },
      process.env.JWT_SECRET || "mysecretkey",
      { expiresIn: "7d" }
    );

    // 6️⃣ Send response
    res.status(200).json({
      token,
      assistantManager: {
        id: assistantManager._id,
        name: assistantManager.name,
        email: assistantManager.email,
        role: assistantManager.role,
        status: assistantManager.status,
      },
    });
  } catch (err) {
    console.error("Assistant Manager Login Error:", err);
    res.status(500).json({ message: "Server error during assistant manager login" });
  }
};


// ✅ Create Assistant Manager
exports.createAssistantManager = async (req, res) => {
  try {
    const { name, email, password, contactNumber, managerId } = req.body;

    // ✅ Create Assistant Manager in Staff collection
    const newAM = new Staff({
      name,
      email,
      password,
      contactNumber,
      role: "assistant_manager",
      managerId, // reference to manager
    });

    await newAM.save();
    res.status(201).json(newAM);
  } catch (err) {
    console.error("Error creating assistant manager:", err);
    res.status(500).json({ error: "Failed to create assistant manager" });
  }
};

// ✅ Get All Assistant Managers
exports.getAssistantManagers = async (req, res) => {
  try {
    // ✅ Fetch staff where role = assistant_manager
    const assistants = await Staff.find({ role: "assistant_manager" })
      .populate("managerId", "name email"); // populate manager info
    console.log(assistants,"assistantssssss");
    
    res.json(assistants);
  } catch (err) {
    console.error("Error fetching assistant managers:", err);
    res.status(500).json({ error: "Failed to fetch assistant managers" });
  }
};

// ✅ Login Assistant Manager
// exports.loginAssistantManager = async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     const assistantManager = await Staff.findOne({ email });

//     if (!assistantManager) {
//       return res.status(404).json({ error: "Assistant Manager not found" });
//     }

//     const isMatch = await assistantManager.matchPassword(password);
//     if (!isMatch) {
//       return res.status(401).json({ error: "Invalid password" });
//     }

//     const token = generateToken(assistantManager._id);
//     res.status(200).json({
//       token,
//       assistantManager: {
//         id: assistantManager._id,
//         email: assistantManager.email,
//         name: assistantManager.name,
//       },
//     });
//   } catch (err) {
//     console.error("Assistant Manager login error:", err);
//     res.status(500).json({ error: "Server error" });
//   }
// };
