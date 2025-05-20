const { getConnection } = require("../config/db");
const { handleError } = require("../utils/errorHandler");
const bcrypt = require("bcrypt");
const sql = require("mssql");

const now = new Date();

const login = async (req, res) => {
  const { user, password } = req.body;
  try {
    const pool = await getConnection();
    const result = await pool
      .request()
      .input("user", sql.NVarChar, user)
      .query("SELECT * FROM mtbl_users WHERE employee_id = @user");
    const dbUser = result.recordset[0];

    if (!dbUser) return res.status(404).json({ message: "User not found" });
    if (!dbUser.password)
      return res.status(500).json({ message: "Password not found" });

    const isMatch = await bcrypt.compare(password, dbUser.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid password" });

    res.json({ message: "Login successful", user: dbUser });
  } catch (err) {
    handleError(res, "Login failed", err);
  }
};

const updatePasswords = async (_, res) => {
  try {
    const hashedPassword = await bcrypt.hash("Bonchon1234", 10);
    const pool = await getConnection();
    await pool
      .request()
      .input("hashedPassword", sql.VarChar, hashedPassword)
      .query("UPDATE mtbl_users SET password = @hashedPassword");
    res.json({ message: "All user passwords updated." });
  } catch (err) {
    handleError(res, "Failed to update passwords", err);
  }
};

module.exports = {
  login,
  updatePasswords,
};
