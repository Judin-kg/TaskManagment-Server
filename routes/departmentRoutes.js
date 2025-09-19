const express = require("express");
const router = express.Router();
const { getDepartments, createDepartment, deleteDepartment } = require("../controllers/departmentController");

// GET all departments
router.get("/", getDepartments);

// POST create department
router.post("/", createDepartment);

// DELETE department
router.delete("/:id", deleteDepartment);

module.exports = router;
