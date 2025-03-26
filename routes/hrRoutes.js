const express = require("express");

const { addNewEmployee } = require("../controllers/hrController");

const { validateAddNewEmployee } = require("../middleware/validationChecks");
const { authMiddleware, adminMiddleware } = require("../middleware/authMiddleware");

const router = express.Router();


router.post("/addNewEmployee", [authMiddleware , adminMiddleware] , validateAddNewEmployee, addNewEmployee);

module.exports = router;
