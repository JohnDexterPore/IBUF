const express = require("express");
const sql = require("mssql");
const cors = require("cors");
const bcrypt = require("bcrypt");

const app = express();
app.use(cors());
app.use(express.json());

const now = new Date();

const dbConfig = {
  user: "sa",
  password: "b1@dmin2022",
  server: "172.16.200.215",
  database: "Item_Buildup",
  options: {
    trustServerCertificate: true,
    enableArithAbort: true,
    trustedConnection: false,
    instancename: "SQLEXPRESS",
  },
  port: 1433,
};

let pool;
async function getConnection() {
  if (!pool) {
    pool = await sql.connect(dbConfig);
    console.log("✅ Database connected");
  }
  return pool;
}

// Listen
app.listen(3001, async () => {
  console.log("🚀 Server is running on port 3001");
  try {
    await getConnection();
  } catch (err) {
    console.error("❌ DB Connection Failed:", err);
  }
});

// Utility: Error handler
const handleError = (res, msg, err) => {
  console.error(msg, err);
  res.status(500).json({ error: msg });
};

//
// ROUTES
//

// 🏢 Companies
app.get("/getCompanies", async (_, res) => {
  try {
    const pool = await getConnection();
    const result = await pool.request().query(`SELECT * FROM mtbl_companies`);
    res.json(result.recordset);
  } catch (err) {
    handleError(res, "Failed to fetch companies", err);
  }
});

// 🧭 Navigation
app.get("/getNavigation/:userType", async (req, res) => {
  const { userType } = req.params;
  let condition = "";

  switch (parseInt(userType, 10)) {
    case 1:
      condition = "WHERE user_type != 0";
      break;
    case 2:
      condition = "WHERE user_type = 2";
      break;
    case 0:
      break;
    default:
      return res.status(400).send("Invalid userType");
  }

  try {
    const pool = await getConnection();
    const result = await pool
      .request()
      .query(`SELECT * FROM mtbl_navigation ${condition}`);
    res.json(result.recordset);
  } catch (err) {
    handleError(res, "Failed to fetch navigation", err);
  }
});

// 👥 Users
app.get("/getUsers", async (_, res) => {
  try {
    const pool = await getConnection();
    const result = await pool
      .request()
      .query(`SELECT * FROM mtbl_users ORDER BY first_name`);
    res.json(result.recordset);
  } catch (err) {
    handleError(res, "Failed to fetch users", err);
  }
});

app.get("/getExternalUsers/:employeeId", async (req, res) => {
  const { employeeId } = req.params;
  try {
    const pool = await getConnection();
    const result = await pool
      .request()
      .input("empID", sql.VarChar, `%${employeeId}%`).query(`
        SELECT EmployeeID, FirstName, LastName, JobTitle, Department, EmailAddress
        FROM SCFHPAYROLL.PAYROLL.dbo.vw_EmpListActive AS A
        WHERE (EmpStatus IN ('30', '10')) AND Company = '100' 
          AND DeptID IN ('HR', 'IT', 'CA', 'MK', 'AC')
          AND EmployeeID LIKE @empID
          AND NOT EXISTS (
            SELECT 1 FROM mtbl_users B WHERE B.employee_id = A.EmployeeID
          );
      `);
    res.json(result.recordset);
  } catch (err) {
    handleError(res, "Failed to fetch external users", err);
  }
});

// 📧 Email Updates
app.get("/updateEmails", async (_, res) => {
  try {
    const pool = await getConnection();
    await pool.request().input("now", sql.DateTime, now).query(`
      UPDATE u
      SET u.email = v.EmailAddress, u.edit_date = @now, u.edit_by = 'Admin'
      FROM mtbl_users u
      JOIN SCFHPAYROLL.PAYROLL.dbo.vw_EmpListActive v ON u.employee_id = v.EmployeeID
      WHERE (v.EmpStatus IN ('30', '10')) AND v.Company = '100'
        AND v.DeptID IN ('HR', 'IT', 'CA', 'MK', 'AC');
    `);
    res.json({ message: "Emails updated successfully" });
  } catch (err) {
    handleError(res, "Failed to update emails", err);
  }
});

// 🔐 Password Updates
app.get("/updatePasswords", async (_, res) => {
  try {
    const hashedPassword = await bcrypt.hash("Bonchon1234", 10);
    const pool = await getConnection();
    await pool
      .request()
      .input("hashedPassword", sql.VarChar, hashedPassword)
      .query(`UPDATE mtbl_users SET password = @hashedPassword`);
    res.json({ message: "All user passwords updated." });
  } catch (err) {
    handleError(res, "Failed to update passwords", err);
  }
});

// 📂 Dropdown
app.get("/getDropdown", async (_, res) => {
  try {
    const pool = await getConnection();
    const result = await pool.request().query(`SELECT * FROM mtbl_dropdown`);
    res.json(result.recordset);
  } catch (err) {
    handleError(res, "Failed to fetch dropdown", err);
  }
});

// 🔓 Login
app.post("/login", async (req, res) => {
  const { user, password } = req.body;
  try {
    const pool = await getConnection();
    const result = await pool
      .request()
      .input("user", sql.NVarChar, user)
      .query(`SELECT * FROM mtbl_users WHERE employee_id = @user`);
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
});

// ➕ Add User
app.post("/addUser", async (req, res) => {
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
      .input("now", sql.DateTime, now).query(`
        INSERT INTO mtbl_users
        (employee_id, account_type, first_name, last_name, job_title, department, email, password, created_date, created_by)
        VALUES (@employee_id, @account_type, @first_name, @last_name, @job_title, @department, @email, @password, @now, @user_id);
      `);
    res.json({ message: "User added successfully" });
  } catch (err) {
    handleError(res, "Failed to add user", err);
  }
});

// 🗑️ Delete User
app.delete("/deleteUser/:employeeId", async (req, res) => {
  const { employeeId } = req.params;
  try {
    const pool = await getConnection();
    await pool
      .request()
      .input("employeeId", sql.VarChar, employeeId)
      .query(`DELETE FROM mtbl_users WHERE employee_id = @employeeId`);
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    handleError(res, "Failed to delete user", err);
  }
});

// ✏️ Update User
app.put("/updateUser", async (req, res) => {
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

    await request.query(`
      UPDATE mtbl_users SET 
        account_type = @account_type,
        first_name = @first_name,
        last_name = @last_name,
        job_title = @job_title,
        department = @department,
        email = @email
        ${passwordClause},
        edit_date = @now,
        edit_by = @user_id
      WHERE employee_id = @employee_id;
    `);

    res.json({ message: "User updated successfully" });
  } catch (err) {
    handleError(res, "Failed to update user", err);
  }
});
