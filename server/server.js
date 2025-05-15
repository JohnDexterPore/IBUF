const express = require("express");
const sql = require("mssql");
const cors = require("cors");
const bcrypt = require("bcrypt");

const app = express();
app.use(cors());
app.use(express.json()); // Allow JSON request body

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
        WHERE EmployeeID = @user
      `);

    const dbUser = result.recordset[0];

    if (!dbUser) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!dbUser.Password) {
      return res
        .status(500)
        .json({ message: "Password not found in database" });
    }

    const isMatch = await bcrypt.compare(password, dbUser.Password);

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
      condition = "WHERE [userType] != 0";
      break;
    case 2:
      condition = "WHERE [userType] = 2";
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
      SELECT * FROM [Item_Buildup].[dbo].[mtbl_users] ORDER BY FirstName
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
          EmpStatus = '30' 
          AND Company = '100' 
          AND DeptID IN ('HR', 'IT', 'CA', 'MK', 'AC')
          AND EmployeeID LIKE @empID
          AND NOT EXISTS (
            SELECT 1 
            FROM Item_Buildup.dbo.mtbl_users AS B
            WHERE B.EmployeeID = A.EmployeeID
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
      SET u.Email = v.EmailAddress
      FROM [Item_Buildup].[dbo].[mtbl_users] u
      JOIN SCFHPAYROLL.PAYROLL.dbo.vw_EmpListActive v
        ON u.EmployeeID = v.EmployeeID
      WHERE v.EmpStatus = '30'
        AND v.Company = '100'
        AND v.DeptID IN ('HR', 'IT', 'CA', 'MK', 'AC');
    `;

    await pool.request().query(query);
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
