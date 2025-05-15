const express = require("express");
const sql = require("mssql");
const cors = require("cors");
const bcrypt = require("bcrypt");

const app = express();
app.use(cors());
app.use(express.json()); // Allow JSON request body

const now = new Date(); // Get current date from Node.js server

const config = {
  user: "sa",
  password: "b1@dmin2022",
  server: "172.16.200.215",
  database: "Item_Buildup",
  options: {
    trustServerCertificate: true,
    trustedConnection: false,
    enableArithAbout: true,
    instancename: "SQLEXPRESS",
  },
  port: 1433,
};

let pool;

async function getConnection() {
  if (!pool) {
    pool = await sql.connect(config);
    console.log("Database connected successfully.");
  }
  return pool;
}

app.listen(3001, async () => {
  console.log("Server is running on port 3001");
  try {
    await getConnection(); // Connect to the database
  } catch (err) {
    console.error("Database connection failed:", err);
  }
});

app.post("/login", async (req, res) => {
  const { user, password } = req.body;

  try {
    const pool = await getConnection();
    const result = await pool.request().input("user", sql.NVarChar, user)
      .query(`
        SELECT * FROM [Item_Buildup].[dbo].[mtbl_users]
        WHERE employee_id = @user
      `);

    const dbUser = result.recordset[0];
    if (!dbUser) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!dbUser.password) {
      return res
        .status(500)
        .json({ message: "Password not found in database" });
    }

    const isMatch = await bcrypt.compare(password, dbUser.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }

    res.json({ message: "Login successful", user: dbUser });
  } catch (err) {
    console.error(err);
    res.status(500).send("Login failed");
  }
});

app.get("/getCompanies", async (req, res) => {
  try {
    const pool = await getConnection();
    const result = await pool.request().query(`
      SELECT * FROM [Item_Buildup].[dbo].[mtbl_companies]
    `);
    res.json(result.recordset);
  } catch (err) {
    console.error(err);
    res.status(500).send("Failed to fetch companies");
  }
});

app.get("/getNavigation/:userType", async (req, res) => {
  const userType = parseInt(req.params.userType, 10);
  let condition = "";

  // Build WHERE condition based on userType
  switch (userType) {
    case 0:
      condition = ""; // No filter
      break;
    case 1:
      condition = "WHERE [user_type] != 0";
      break;
    case 2:
      condition = "WHERE [user_type] = 2";
      break;
    default:
      return res.status(400).send("Invalid userType");
  }

  try {
    const pool = await getConnection();
    const result = await pool
      .request()
      .query(
        `SELECT * FROM [Item_Buildup].[dbo].[mtbl_navigation] ${condition}`
      );
    res.json(result.recordset);
  } catch (err) {
    console.error("Navigation Fetch Error:", err);
    res.status(500).send("Failed to fetch Navigation");
  }
});

app.get("/getUsers", async (req, res) => {
  try {
    const pool = await getConnection();
    const result = await pool.request().query(`
      SELECT * FROM [Item_Buildup].[dbo].[mtbl_users] ORDER BY first_name
    `);
    res.json(result.recordset);
  } catch (err) {
    console.error(err);
    res.status(500).send("Failed to fetch users");
  }
});

app.get("/getExternalUsers/:employeeId", async (req, res) => {
  const { employeeId } = req.params;

  try {
    // Example SQL or logic to fetch users
    const result = await pool
      .request()
      .input("empID", sql.VarChar, `%${employeeId}%`).query(`
        SELECT 
          EmployeeID, 
          FirstName, 
          LastName, 
          JobTitle, 
          Department, 
          EmailAddress
        FROM SCFHPAYROLL.PAYROLL.dbo.vw_EmpListActive AS A
        WHERE 
          (EmpStatus = '30' OR EmpStatus = '10')
          AND Company = '100' 
          AND DeptID IN ('HR', 'IT', 'CA', 'MK', 'AC')
          AND EmployeeID LIKE @empID
          AND NOT EXISTS (
            SELECT 1 
            FROM Item_Buildup.dbo.mtbl_users AS B
            WHERE B.employee_id = A.EmployeeID
          );
      `);

    res.json(result.recordset);
  } catch (err) {
    console.error("Database error:", err.message);
    console.error(err.stack);
    res.status(500).json({ error: "Failed to fetch external users" });
  }
});

app.get("/updateEmails", async (req, res) => {
  try {
    const pool = await sql.connect(/* your DB config */);

    const query = `
      UPDATE u
      SET u.email = v.EmailAddress,
          u.edit_date = @now,
          u.edit_by = 'Admin'
      FROM [Item_Buildup].[dbo].[mtbl_users] u
      JOIN SCFHPAYROLL.PAYROLL.dbo.vw_EmpListActive v
        ON u.employee_id = v.EmployeeID
      WHERE (v.EmpStatus = '30' OR v.EmpStatus = '10')
        AND v.Company = '100'
        AND v.DeptID IN ('HR', 'IT', 'CA', 'MK', 'AC');
    `;

    await pool.request().input("now", sql.DateTime, now).query(query);

    res.status(200).json({ message: "Emails updated successfully." });
  } catch (err) {
    console.error("Email update error:", err);
    res.status(500).json({ error: "Failed to update emails" });
  }
});

app.get("/updatePasswords", async (req, res) => {
  try {
    const saltRounds = 10;
    const plainPassword = "Bonchon1234";
    const hashedPassword = await bcrypt.hash(plainPassword, saltRounds);

    const pool = await getConnection();
    await pool.request().input("hashedPassword", hashedPassword).query(`
        UPDATE [Item_Buildup].[dbo].[mtbl_users]
        SET [Password] = @hashedPassword
      `);

    res.json({ message: "All user passwords updated to hashed value." });
  } catch (err) {
    console.error(err);
    res.status(500).send("Failed to update passwords");
  }
});

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
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

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
        INSERT INTO [Item_Buildup].[dbo].[mtbl_users]
        (employee_id, account_type, first_name, last_name, job_title, department, email, password, created_date, created_by)
        VALUES (@employee_id, @account_type, @first_name, @last_name, @job_title, @department, @email, @password, @now, @user_id);
      `);

    res.json({ message: "User added successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).send("Failed to add user");
  }
});

app.delete("/deleteUser/:employeeId", async (req, res) => {
  const { employeeId } = req.params;
  console.log("Deleting user with EmployeeID:", employeeId);

  try {
    const pool = await getConnection();
    await pool.request().input("employeeId", sql.VarChar, employeeId).query(`
        DELETE FROM [Item_Buildup].[dbo].[mtbl_users]
        WHERE employee_id = @employeeId;
      `);

    res.json({ message: "User deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).send("Failed to delete user");
  }
});

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
    const request = new sql.Request();

    // Always required inputs
    request.input("employee_id", sql.VarChar, employee_id);
    request.input("account_type", sql.Int, account_type);
    request.input("first_name", sql.VarChar, first_name);
    request.input("last_name", sql.VarChar, last_name);
    request.input("job_title", sql.VarChar, job_title);
    request.input("department", sql.VarChar, department);
    request.input("email", sql.NVarChar, email);
    request.input("user_id", sql.VarChar, user_id); // Editor
    request.input("now", sql.DateTime, now); // Timestamp

    // Optional password update
    let passwordClause = "";
    if (password && password.trim() !== "") {
      const hashedPassword = await bcrypt.hash(password, 10);
      passwordClause = ", password = @password";
      request.input("password", sql.NVarChar, hashedPassword);
    }

    // Final SQL query
    const query = `
      UPDATE [Item_Buildup].[dbo].[mtbl_users]
      SET 
        account_type = @account_type,
        first_name = @first_name,
        last_name = @last_name,
        job_title = @job_title,
        department = @department,
        email = @email
        ${passwordClause},
        edit_date = @now,
        edit_by = @user_id
      WHERE employee_id = @employee_id
    `;

    await request.query(query);
    res.status(200).json({ message: "User updated successfully" });
  } catch (err) {
    console.error("Error updating user:", err);
    res.status(500).json({
      message: "Failed to update user",
      error: err.message,
    });
  }
});
