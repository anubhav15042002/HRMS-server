const express = require("express");

const { addNewEmployee, employeesListing } = require("../controllers/hrController");

const { validateAddNewEmployee } = require("../middleware/validationChecks");
const { authMiddleware, adminMiddleware } = require("../middleware/authMiddleware");

const router = express.Router();


router.post("/addNewEmployee", [authMiddleware , adminMiddleware] , validateAddNewEmployee, addNewEmployee);
router.post("/employeesListing" ,  [authMiddleware , adminMiddleware] , employeesListing );


module.exports = router;
