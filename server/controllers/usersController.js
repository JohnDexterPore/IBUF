const { getConnection } = require("../config/db");
const { handleError } = require("../utils/errorHandler");
const sql = require("mssql");
const bcrypt = require("bcrypt");

const now = new Date();

const getUsers = async (_, res) => {
  try {
    const pool = await getConnection();
    const result = await pool
      .request()
      .query("SELECT * FROM mtbl_users ORDER BY first_name");
    res.json(result.recordset);
  } catch (err) {
    handleError(res, "Failed to fetch users", err);
  }
};

const getExternalUsers = async (req, res) => {
  const { employeeId } = req.params;
  try {
    const pool = await getConnection();
    const result = await pool
      .request()
      .input("empID", sql.VarChar, `%${employeeId}%`)
      .query(
        "SELECT EmployeeID, FirstName, LastName, JobTitle, Department, EmailAddress " +
        "FROM SCFHPAYROLL.PAYROLL.dbo.vw_EmpListActive AS A " +
        "WHERE (EmpStatus IN ('30', '10')) AND Company = '100' " +
        "AND DeptID IN ('HR', 'IT', 'CA', 'MK', 'AC') " +
        "AND EmployeeID LIKE @empID " +
        "AND NOT EXISTS ( " +
        "SELECT 1 FROM mtbl_users B WHERE B.employee_id = A.EmployeeID " +
        ")"
      );
    res.json(result.recordset);
  } catch (err) {
    handleError(res, "Failed to fetch external users", err);
  }
};

const addUser = async (req, res) => {
  const {
    employee_id,
    account_type,
    first_name,
    last_name,
    job_title,
    department,
    email,
    password,
    user_id,
  } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const pool = await getConnection();
    await pool
      .request()
      .input("employee_id", sql.VarChar, employee_id)
      .input("account_type", sql.Int, account_type)
      .input("first_name", sql.VarChar, first_name)
      .input("last_name", sql.VarChar, last_name)
      .input("job_title", sql.VarChar, job_title)
      .input("department", sql.VarChar, department)
      .input("email", sql.VarChar, email)
      .input("password", sql.VarChar, hashedPassword)
      .input("user_id", sql.VarChar, user_id)
      .input("now", sql.DateTime, now)
      .query(
        "INSERT INTO mtbl_users " +
        "(employee_id, account_type, first_name, last_name, job_title, department, email, password, created_date, created_by) " +
        "VALUES (@employee_id, @account_type, @first_name, @last_name, @job_title, @department, @email, @password, @now, @user_id)"
      );
    res.json({ message: "User added successfully" });
  } catch (err) {
    handleError(res, "Failed to add user", err);
  }
};

const deleteUser = async (req, res) => {
  const { employeeId } = req.params;
  try {
    const pool = await getConnection();
    await pool
      .request()
      .input("employeeId", sql.VarChar, employeeId)
      .query("DELETE FROM mtbl_users WHERE employee_id = @employeeId");
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    handleError(res, "Failed to delete user", err);
  }
};

const updateUser = async (req, res) => {
  const {
    employee_id,
    account_type,
    first_name,
    last_name,
    job_title,
    department,
    email,
    password,
    user_id,
  } = req.body;

  try {
    const request = new sql.Request()
      .input("employee_id", sql.VarChar, employee_id)
      .input("account_type", sql.Int, account_type)
      .input("first_name", sql.VarChar, first_name)
      .input("last_name", sql.VarChar, last_name)
      .input("job_title", sql.VarChar, job_title)
      .input("department", sql.VarChar, department)
      .input("email", sql.NVarChar, email)
      .input("user_id", sql.VarChar, user_id)
      .input("now", sql.DateTime, now);

    let passwordClause = "";
    if (password?.trim()) {
      const hashedPassword = await bcrypt.hash(password, 10);
      request.input("password", sql.VarChar, hashedPassword);
      passwordClause = ", password = @password";
    }

    await request.query(
      "UPDATE mtbl_users SET " +
        "account_type = @account_type, " +
        "first_name = @first_name, " +
        "last_name = @last_name, " +
        "job_title = @job_title, " +
        "department = @department, " +
        "email = @email " +
        passwordClause + ", " +
        "edit_date = @now, " +
        "edit_by = @user_id " +
      "WHERE employee_id = @employee_id"
    );

    res.json({ message: "User updated successfully" });
  } catch (err) {
    handleError(res, "Failed to update user", err);
  }
};

module.exports = {
  getUsers,
  getExternalUsers,
  addUser,
  deleteUser,
  updateUser,
};
