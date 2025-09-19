const express = require("express");
const router = express.Router();
const assistantManagerController = require("../controllers/assistantManagerController");

// Create Assistant Manager
router.post("/", assistantManagerController.createAssistantManager);

// Get All Assistant Managers
router.get("/", assistantManagerController.getAssistantManagers);
router.post("/login",assistantManagerController.loginAssistantManager);

module.exports = router;
