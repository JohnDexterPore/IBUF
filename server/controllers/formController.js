const { getConnection } = require("../config/db");
const { handleError } = require("../utils/errorHandler");
const sql = require("mssql");
const now = new Date();

const addItem = async (req, res) => {
  const {
    parentItemDescription,
    posTxt,
    datePrepared,
    startDate,
    endDate,
    priceTier,
    grossPrice,
    deliveryPrice,
    category,
    subcategory,
    coverage,
    components,
    transactionTypes, // this is an array
    created_by,
  } = req.body;

  try {
    const pool = await getConnection();

    await pool
      .request()
      .input("parentItemDescription", sql.VarChar, parentItemDescription)
      .input("posTxt", sql.VarChar, posTxt)
      .input("datePrepared", sql.Date, datePrepared)
      .input("startDate", sql.Date, startDate)
      .input("endDate", sql.Date, endDate)
      .input("priceTier", sql.VarChar, priceTier)
      .input("grossPrice", sql.Decimal(10, 2), grossPrice)
      .input("deliveryPrice", sql.Decimal(10, 2), deliveryPrice)
      .input("category", sql.VarChar, category)
      .input("subcategory", sql.VarChar, subcategory)
      .input("coverage", sql.VarChar, coverage)
      .input("components", sql.Text, components)
      .input("transactionTypes", sql.VarChar, transactionTypes.join(", ")) // comma-separated string
      .input("now", sql.DateTime, now)
      .input("created_by", sql.VarChar, created_by).query(`
        INSERT INTO tbl_items (
          parent_item_description,
          pos_txt,
          date_prepared,
          start_date,
          end_date,
          price_tier,
          gross_price,
          delivery_price,
          category,
          subcategory,
          coverage,
          components,
          transaction_types,
          created_date,
          created_by
        ) VALUES (
          @parentItemDescription,
          @posTxt,
          @datePrepared,
          @startDate,
          @endDate,
          @priceTier,
          @grossPrice,
          @deliveryPrice,
          @category,
          @subcategory,
          @coverage,
          @components,
          @transactionTypes,
          @now,
          @created_by
        )
      `);

    res.json({ message: "Item added successfully" });
  } catch (err) {
    handleError(res, "Failed to add item", err);
  }
};

const getItem = async (req, res) => {
  const { search } = req.body;
  let condition = "";
  if (search) {
    condition = `WHERE state = ${state} OR id = ${state}`;
  }

  try {
    const pool = await getConnection();
    const result = await pool
      .request()
      .query(`SELECT * FROM tbl_item ${condition}`);
    res.json(result.recordset);
  } catch (err) {
    handleError(res, "Failed to fetch dropdown", err);
  }
};

module.exports = {
  addItem,
  getItem,
};
