const { verifyToken } = require("../utils/authHelper");
const Employee = require("../models/employee");

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Access denied",
    });
  }

  try {
    const decoded = verifyToken(token);
    req.employee = decoded;
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

const adminMiddleware = async (req, res, next) => {
  try {
    const employee = await Employee.findById(req.employee.id); // Fetch user from DB

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    if (employee.role !== 'HR') {
      return res.status(403).json({
        success: false,
        message: "Forbidden route",
      });
    }

    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

module.exports = { authMiddleware, adminMiddleware };
