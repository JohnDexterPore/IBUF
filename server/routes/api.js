const express = require("express");
const router = express.Router();

const { getCompanies } = require("../controllers/companiesController");
const { getNavigation } = require("../controllers/navigationController");
const {
  getUsers,
  getExternalUsers,
  addUser,
  deleteUser,
  updateUser,
} = require("../controllers/usersController");
const { login, updatePasswords } = require("../controllers/authController");
const { getDropdown } = require("../controllers/dropdownController");

// Companies
router.get("/getCompanies", getCompanies);

// Navigation
router.get("/getNavigation/:userType", getNavigation);

// Users
router.get("/getUsers", getUsers);
router.get("/getExternalUsers/:employeeId", getExternalUsers);
router.post("/addUser", addUser);
router.delete("/deleteUser/:employeeId", deleteUser);
router.put("/updateUser", updateUser);

// Auth
router.post("/login", login);
router.get("/updatePasswords", updatePasswords);

// Dropdown
router.get("/getDropdown", getDropdown);

module.exports = router;
