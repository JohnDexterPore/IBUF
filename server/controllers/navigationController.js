const { getConnection } = require("../config/db");
const { handleError } = require("../utils/errorHandler");

const getNavigation = async (req, res) => {
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
      .query("SELECT * FROM mtbl_navigation " + condition);
    res.json(result.recordset);
  } catch (err) {
    handleError(res, "Failed to fetch navigation", err);
  }
};

module.exports = {
  getNavigation,
};
