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
