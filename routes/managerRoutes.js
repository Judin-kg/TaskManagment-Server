const express = require("express");
const router = express.Router();
const { getManagers, createManager,getManagersByDepartment,loginManager,deleteManager,resetManagerPassword} = require("../controllers/managerController");

// GET all managers
router.get("/", getManagers);

// POST create manager
router.post("/", createManager);
router.post("/login", loginManager);
router.delete("/:id", deleteManager);
// Get Managers by Department (optional filter)
router.get("/department/:departmentId",getManagersByDepartment);
// 🔑 Reset password route
router.put("/:id/reset-password", resetManagerPassword);
module.exports = router;
