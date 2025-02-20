const pool = require("../../config/dbconfig");

const countAll = `SELECT COUNT(*) FROM users;`;

const selectAllByZone = `SELECT 
    users.id,
    users.name,
    users.product_name,
    users.cost,
    users.phone_number,
    users.phone_number2,
    users.time,
    users.seller,
    zone.zone_name AS zone_name,  
    workplace.workplace_name AS workplace_name, 
    users.payment_status,
    users.monthly_income,
    users.payment,
    users.passport_series,
    users.description,
    users.given_day,
    users.updatedat
FROM users
JOIN zone ON users.zone = zone.id
JOIN workplace ON users.workplace = workplace.id
  WHERE users.zone = $1
 LIMIT $2 OFFSET $3;`;
const selectAllByZoneAndWorkplace = `
SELECT 
    users.id,
    users.name,
    users.product_name,
    users.cost,
    users.phone_number,
    users.phone_number2,
    users.time,
    users.seller,
    zone.zone_name AS zone_name,  
    workplace.workplace_name AS workplace_name, 
    users.payment_status,
    users.monthly_income,
    users.payment,
    users.passport_series,
    users.description,
    users.given_day,
    users.updatedat
FROM users
JOIN zone ON users.zone = zone.id
JOIN workplace ON users.workplace = workplace.id
  WHERE users.zone = $1 AND users.workplace = $2
 LIMIT $3 OFFSET $4;
`;
const selectByIdQuery = `SELECT 
    users.id,
    users.name,
    users.product_name,
    users.cost,
    users.phone_number,
    users.phone_number2,
    users.time,
    users.seller,
    zone.zone_name AS zone_name,  
    workplace.workplace_name AS workplace_name, 
    users.payment_status,
    users.monthly_income,
    users.payment,
    users.passport_series,
    users.description,
    users.given_day,
    users.updatedat
  FROM users
  JOIN zone ON users.zone = zone.id
  JOIN workplace ON users.workplace = workplace.id
   WHERE users.id = $1;`;

const create = `
    INSERT INTO users (
    name,
    product_name,
    cost,
    phone_number,
    phone_number2,
    time,
    seller,
    zone,
    workplace,
    monthly_income,
    passport_series,
    description,
    given_day
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12,$13)
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
        workplace = $6,
        time = $7,
        seller = $8,
        zone = $9,
        passport_series = $10,
        description = $11,
        given_day = $12,
        monthly_income = $13,
        updatedAt = NOW()
      WHERE id = $14
      RETURNING *;
`;

const deleteUserQuery = `DELETE FROM users WHERE id = $1;`;

const countAllUsers = async () => {
  try {
    const res = await pool.query(countAll);
    return res.rows[0];
  } catch (e) {
    console.error("Error executing query in count", e.message);
    return null;
  }
};

const getAll = async (id, page = 1, limit = 200) => {
  try {
    const offset = (page - 1) * limit;
    const res = await pool.query(selectAllByZone, [id, limit, offset]);
    return res.rows;
  } catch (e) {
    console.error("Error executing query in getAll", e.message);
  }
};

const getByZoneWorkplace = async (
  zone_id,
  workplace_id,
  page = 1,
  limit = 200
) => {
  const offset = (page - 1) * limit;

  try {
    const res = await pool.query(selectAllByZoneAndWorkplace, [
      zone_id,
      workplace_id,
      limit,
      offset,
    ]);
    return res.rows;
  } catch (e) {
    console.error("Error executing query by getByZoneWorkplace", e.message);
  }
};
const getById = async (id) => {
  try {
    const res = await pool.query(selectByIdQuery, [id]);
    return res.rows[0];
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
    workplace_id,
    time,
    zone_id,
    seller,
    passport_series,
    description,
    given_day,
  } = userData;

  const monthly_income = time && cost ? cost / time : 0;

  try {
    const res = await pool.query(create, [
      name,
      product_name,
      cost,
      phone_number,
      phone_number2,
      time,
      seller,
      zone_id,
      workplace_id,
      monthly_income,
      passport_series,
      description,
      given_day,
    ]);
    return res.rows[0];
  } catch (e) {
    console.error("Error executing query by createUser", e.message);
  }
};

const updateModel = async (id, userData) => {
  const {
    name,
    product_name,
    cost,
    phone_number,
    phone_number2,
    workplace_id,
    time,
    seller,
    zone_id,
    passport_series,
    description,
    given_day,
  } = userData;

  const monthly_income = time && cost ? cost / time : 0;

  try {
    const res = await pool.query(updateQuery, [
      name,
      product_name,
      cost,
      phone_number,
      phone_number2,
      workplace_id,
      time,
      seller,
      zone_id,
      passport_series,
      description,
      given_day,
      monthly_income,
      id,
    ]);
    return res.rows[0];
  } catch (e) {
    console.error("Error executing query by updateUser", e.message);
  }
};

const deleteUser = async (id) => {
  try {
    const res = await pool.query(deleteUserQuery, [id]);
    return res.rowCount > 0;
  } catch (e) {
    console.error("Error executing query by deleteUser", e.message);
  }
};

module.exports = {
  getAll,
  getById,
  createUser,
  deleteUser,
  updateModel,
  countAllUsers,
  getByZoneWorkplace,
};
