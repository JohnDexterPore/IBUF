const sql = require("mssql");

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

module.exports = {
  getConnection,
};
