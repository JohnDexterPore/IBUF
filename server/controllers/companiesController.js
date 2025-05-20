const { getConnection } = require("../config/db");
const { handleError } = require("../utils/errorHandler");

const getCompanies = async (_, res) => {
  try {
    const pool = await getConnection();
    const result = await pool.request().query("SELECT * FROM mtbl_companies");
    res.json(result.recordset);
  } catch (err) {
    handleError(res, "Failed to fetch companies", err);
  }
};

module.exports = {
  getCompanies,
};
