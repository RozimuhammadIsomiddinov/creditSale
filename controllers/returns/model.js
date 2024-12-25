const pool = require("../../config/dbconfig");

const selectReturnsQuery = `
    SELECT *FROM returns LIMIT $1 OFFSET $2
`;

const countReturnsQuery = `
    SELECT COUNT(*) FROM returns;
`;

const productNameQuery = `
    SELECT *FROM users WHERE id= $1 AND product_name= $2;
`;
const updateUserStatusQuery = `
    UPDATE users SET payment_status = false, description = $2 WHERE id = $1;
`;
const createQuery = `
        INSERT INTO returns (
        user_id,
        product_name,
        createdat
        )
        VALUES($1,$2,NOW())
        RETURNING *;
`;

const getAll = async (page = 1, limit = 20) => {
  try {
    const offset = (page - 1) * limit;
    const res = await pool.query(selectReturnsQuery, [limit, offset]);
    return res.rows;
  } catch (e) {
    console.error("Error executing query by getAllReturns", e.message);
  }
};

const getCount = async () => {
  try {
    const res = await pool.query(countReturnsQuery);
    return res.rows[0];
  } catch (e) {
    console.error("Error executing query by getCount", e.message);
  }
};

const createReturns = async (returnData) => {
  const { user_id, product_name, reason } = returnData;

  try {
    await pool.query(updateUserStatusQuery, [user_id, reason]);
    const res = await pool.query(createQuery, [user_id, product_name]);
    return res.rows;
  } catch (e) {
    console.error("Error executing query by createReturns", e.message);
  }
};
module.exports = { getAll, getCount, createReturns, productNameQuery };
