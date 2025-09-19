const express = require("express");
const router = express.Router();
const { getManagers, createManager,getManagersByDepartment,loginManager } = require("../controllers/managerController");

// GET all managers
router.get("/", getManagers);

// POST create manager
router.post("/", createManager);
router.post("/login", loginManager);
// Get Managers by Department (optional filter)
router.get("/department/:departmentId",getManagersByDepartment);

module.exports = router;
