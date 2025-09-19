const express = require("express");
const { registerStaff, loginStaff, getAllStaff } = require("../controllers/staffController");

const router = express.Router();

// Routes
router.post("/register", registerStaff); // staff registration
router.post("/login", loginStaff);       // staff login
router.get("/", getAllStaff);           // list staff

module.exports = router;
