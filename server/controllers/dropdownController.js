const { getConnection } = require("../config/db");
const { handleError } = require("../utils/errorHandler");

const getDropdown = async (_, res) => {
  try {
    const pool = await getConnection();
    const result = await pool.request().query("SELECT * FROM mtbl_dropdown");
    res.json(result.recordset);
  } catch (err) {
    handleError(res, "Failed to fetch dropdown", err);
  }
};

module.exports = {
  getDropdown,
};
