const express = require("express");

const router = express.Router();

const employeeRoutes = require("./employeeRoutes");

const hrRoutes = require("./hrRoutes");

router.use("/auth", employeeRoutes);
router.use("/hr" , hrRoutes);

module.exports = router;
