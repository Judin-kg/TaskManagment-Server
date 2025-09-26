const express = require("express");
const router = express.Router();
const { getManagers, createManager,getManagersByDepartment,loginManager,deleteManager} = require("../controllers/managerController");

// GET all managers
router.get("/", getManagers);

// POST create manager
router.post("/", createManager);
router.post("/login", loginManager);
router.delete("/:id", deleteManager);
// Get Managers by Department (optional filter)
router.get("/department/:departmentId",getManagersByDepartment);

module.exports = router;
