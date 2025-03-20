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
    users.updatedat,
    COALESCE(p.payment_amount, 0) AS last_payment_amount,
    p.payment_date AS last_payment_date 
FROM users 
JOIN zone ON users.zone = zone.id
JOIN workplace ON users.workplace = workplace.id
LEFT JOIN (
    SELECT DISTINCT ON (user_id) user_id, payment_amount, payment_date
    FROM payment
    ORDER BY user_id, payment_date DESC
) p ON users.id = p.user_id
WHERE users.recycle = false AND users.zone = $1 
LIMIT $2 OFFSET $3;
`;

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
    users.updatedat,
    COALESCE(p.payment_amount, 0) AS last_payment_amount,
    p.payment_date AS last_payment_date 
FROM users
JOIN zone ON users.zone = zone.id
JOIN workplace ON users.workplace = workplace.id
LEFT JOIN (
    SELECT DISTINCT ON (user_id) user_id, payment_amount, payment_date
    FROM payment
    ORDER BY user_id, payment_date DESC
) p ON users.id = p.user_id
  WHERE users.recycle = false AND users.zone = $1 AND users.workplace = $2
 LIMIT $3 OFFSET $4;
`;

const selectByZoneAndWorkplaceBool = `
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
    users.updatedat,
    COALESCE(p.payment_amount, 0) AS last_payment_amount,
    p.payment_date AS last_payment_date 
FROM users
JOIN zone ON users.zone = zone.id
JOIN workplace ON users.workplace = workplace.id
LEFT JOIN (
    SELECT DISTINCT ON (user_id) user_id, payment_amount, payment_date
    FROM payment
    ORDER BY user_id, payment_date DESC
) p ON users.id = p.user_id
  WHERE users.recycle = false AND users.zone = $1 AND users.workplace = $2 AND users.payment_status = $3
 LIMIT $4 OFFSET $5;
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
    users.recycle, 
    users.updatedat, 
    COALESCE(p.payment_amount, 0) AS last_payment_amount, 
    users.cost - COALESCE(users.payment, 0) AS rest, 
    p.payment_date AS last_payment_date 
FROM users 
JOIN zone ON users.zone = zone.id 
JOIN workplace ON users.workplace = workplace.id 
LEFT JOIN ( 
    SELECT DISTINCT ON (user_id) user_id, payment_amount, payment_date 
    FROM payment 
    ORDER BY user_id, payment_date DESC 
) p ON users.id = p.user_id 
WHERE users.id = $1;
`;

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

const searchQuery = `
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
    users.updatedat,
    COALESCE(p.payment_amount, 0) AS last_payment_amount,
    p.payment_date AS last_payment_date 
  FROM users
  JOIN zone ON users.zone = zone.id
  JOIN workplace ON users.workplace = workplace.id
  LEFT JOIN (
      SELECT DISTINCT ON (payment.user_id) 
          payment.user_id, 
          payment.payment_amount, 
          payment.payment_date
      FROM payment
      ORDER BY payment.user_id, payment.payment_date DESC
  ) p ON users.id = p.user_id
  WHERE 
    users.recycle = false 
    AND (
      (LENGTH($1) > 1 AND to_tsvector('simple', users.name) @@ plainto_tsquery($1)) 
      OR users.name ILIKE $1
      OR users.phone_number = $2
      OR users.phone_number2 = $2
      OR users.id::TEXT = $3
    );
`;

const deleteUserQuery = `DELETE FROM users WHERE id = $1;`;

const fakeUsers = async () => {
  const checkUsers = await pool.query("SELECT COUNT(*) FROM users");
  if (parseInt(checkUsers.rows[0].count) > 0) {
    return "6000 talik userlar yaratilgan";
  }
  const users = Array.from({ length: 6000 }, (_, i) => [
    "avaz",
    "telefon",
    1000,
    "+998940568974",
    "+99897465205",
    10,
    "aziz",
    Math.ceil(Math.random() * 15),
    1,
    100,
    "AC4965613",
    "yaxshi odam",
    new Date(),
  ]);
  console.log(users);
  const placeholders = users
    .map(
      (_, i) => `($${i * 13 + 1}, $${i * 13 + 2}, $${i * 13 + 3}, $${
        i * 13 + 4
      }, 
               $${i * 13 + 5}, $${i * 13 + 6}, $${i * 13 + 7}, $${i * 13 + 8}, 
               $${i * 13 + 9}, $${i * 13 + 10}, $${i * 13 + 11}, $${
        i * 13 + 12
      }, 
               $${i * 13 + 13})`
    )
    .join(", ");
  const flattenedValues = users.flat();

  const query = `
    INSERT INTO users (
      name, product_name, cost, phone_number, phone_number2, time, seller, zone,
      workplace, monthly_income, passport_series, description, given_day
    ) VALUES ${placeholders} RETURNING *;
  `;

  const result = await pool.query(query, flattenedValues);
  return result.rows;
};

fakeUsers().then((a) => console.log(a));
const countAllUsers = async () => {
  try {
    const res = await pool.query(countAll);
    return res.rows[0];
  } catch (e) {
    console.error("Error executing query in count", e.message);
    return null;
  }
};

const getAll = async (id, page = 1, limit = 2000) => {
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
  limit = 20000
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

const getByZoneWorkplaceBoolean = async (
  zone_id,
  workplace_id,
  payment_status,
  page = 1,
  limit = 2000
) => {
  const offset = (page - 1) * limit;
  try {
    const res = await pool.query(selectByZoneAndWorkplaceBool, [
      zone_id,
      workplace_id,
      payment_status,
      limit,
      offset,
    ]);
    return res.rows;
  } catch (e) {
    console.error(
      "Error executing query by getByZoneWorkplaceBoolean",
      e.message
    );
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
    return res.rowCount;
  } catch (e) {
    console.error("Error executing query by deleteUser", e.message);
  }
};

const search = async (q) => {
  try {
    const values = [`%${q}%`, q, q];
    const res = await pool.query(searchQuery, values);
    return res.rows;
  } catch (e) {
    console.error("Error executing query by search", e.message);
  }
};
module.exports = {
  search,
  getAll,
  getById,
  createUser,
  deleteUser,
  updateModel,
  countAllUsers,
  getByZoneWorkplace,
  getByZoneWorkplaceBoolean,
};
