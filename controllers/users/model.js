const pool = require("../../config/dbconfig");

const selectAll = `
    SELECT *FROM users LIMIT $1 OFFSET $2
`;

const selectByIdQuery = `
    SELECT *FROM users WHERE id=$1
`;

const create = `
    INSERT INTO users (
    name,
    product_name,
    cost,
    phone_number,
    phone_number2,
    address,
    workplace,
    time,
    primary_payment,
    passport_series,
    description,
    given_day,
    monthly_income
    )
    VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)
    RETURNING *;
`;

const updateQuery = `
      UPDATE users 
      SET 
        name = $1,
        product_name = $2,
        cost = $3,
        phone_number = $4,
        phone_number2 = $5,
        address = $6,
        workplace = $7,
        time = $8,
        primary_payment = $9,
        passport_series = $10,
        description = $11,
        given_day = $12,
        monthly_income = $13,
        updatedAt = NOW()
      WHERE id = $14
      RETURNING *;
`;
const getAll = async (page = 1, limit = 20) => {
  try {
    const offset = (page - 1) * limit;
    const res = await pool.query(selectAll, [limit, offset]);
    return res.rows;
  } catch (e) {
    console.error("Error executing query in getAll", e.message);
  }
};
const getById = async (id) => {
  try {
    const res = await pool.query(selectByIdQuery, [id]);
    return res.rows;
  } catch (e) {
    console.error("Error executing query by getById", e.message);
  }
};

const createUser = async (userData) => {
  const {
    name,
    product_name,
    cost,
    phone_number,
    phone_number2,
    address,
    workplace,
    time,
    primary_payment,
    passport_series,
    description,
    given_day,
  } = userData;
  const monthly_income = (cost - primary_payment) / time;
  try {
    const res = await pool.query(create, [
      name,
      product_name,
      cost,
      phone_number,
      phone_number2,
      address,
      workplace,
      time,
      primary_payment,
      passport_series,
      description,
      given_day,
      monthly_income,
    ]);
    return res.rows[0];
  } catch (e) {
    console.error("Error executing query by createuser", e.message);
  }
};

const updateModel = async (id, userData) => {
  const {
    name,
    product_name,
    cost,
    phone_number,
    phone_number2,
    address,
    workplace,
    time,
    primary_payment,
    passport_series,
    description,
    given_day,
    monthly_income,
  } = userData;

  try {
    const res = await pool.query(updateQuery, [
      name,
      product_name,
      cost,
      phone_number,
      phone_number2,
      address,
      workplace,
      time,
      primary_payment,
      passport_series,
      description,
      given_day,
      monthly_income,
      id,
    ]);
    return res.rows;
  } catch (e) {
    console.error("Error executing query by updateUser", e.message);
  }
};
module.exports = { getAll, getById, createUser, updateModel };