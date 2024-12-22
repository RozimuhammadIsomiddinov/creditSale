const pool = require("../../config/dbconfig");

const selectIncomeQuery = `
    SELECT SUM(cost) FROM users;
`;

const selectUsersQuery = `
      SELECT COUNT(*)  FROM users;
`;

const selectPrimaryPaymentQuery = `
    SELECT COUNT(*) FROM users WHERE primary_payment!=0;
`;
const sumPrimaryPaymentQuery = `
    SELECT SUM(primary_payment) FROM users;
`;

const selectPrimaryUsersQuery = `
    SELECT *FROM users WHERE primary_payment!=0 LIMIT $1 OFFSET $2;
`;
const sumThisMonth = `
SELECT SUM(payment) 
  FROM users 
    WHERE DATE_PART('year', given_day) = DATE_PART('year', CURRENT_DATE)
    AND DATE_PART('month', given_day) = DATE_PART('month', CURRENT_DATE);
`;
const selectMonthUsersQuery = `
    SELECT * FROM users WHERE DATE_PART('year', given_day) = DATE_PART('year', CURRENT_DATE)
  AND DATE_PART('month', given_day) = DATE_PART('month', CURRENT_DATE);
`;
const selectIncome = async () => {
  try {
    const { rows: incomeRows } = await pool.query(selectIncomeQuery);

    const { rows: userRows } = await pool.query(selectUsersQuery);

    return { income: incomeRows, users: userRows };
  } catch (e) {
    console.error("Error executing query by selectIncome", e.message);
  }
};

const selectPrimaryPayment = async () => {
  try {
    const { rows: select } = await pool.query(selectPrimaryPaymentQuery);
    const { rows: count } = await pool.query(sumPrimaryPaymentQuery);
    return { select, count };
  } catch (e) {
    console.error("Error executing query by selectPriamryPayment", e.message);
  }
};

const selectPrimaryUsers = async (page = 1, limit = 20) => {
  try {
    const offset = (page - 1) * limit;
    const res = await pool.query(selectPrimaryUsersQuery, [limit, offset]);
    return res.rows;
  } catch (e) {
    console.error("Error executing query by selectPriamryUsers", e.message);
  }
};

const selectThisMonth = async () => {
  try {
    const res = await pool.query(sumThisMonth);
    return res.rows;
  } catch (e) {
    console.error("Error executing query by selectThisMonth", e.message);
  }
};
module.exports = {
  selectIncome,
  selectPrimaryPayment,
  selectPrimaryUsers,
  selectThisMonth,
};
