const express = require("express");
const { registerStaff, loginStaff, getAllStaff,resetStaffPassword } = require("../controllers/staffController");

const router = express.Router();

// Routes
router.post("/register", registerStaff); // staff registration
router.post("/login", loginStaff);       // staff login
router.get("/", getAllStaff);    
// 🔑 Reset password route
router.put("/:id/reset-password", resetStaffPassword);       // list staff

module.exports = router;
