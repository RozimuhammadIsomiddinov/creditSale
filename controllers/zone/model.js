const pool = require("../../config/dbconfig");

const selectQuery = `
    SELECT *FROM zone;
`;

const selectByIdQuery = `
        SELECT *FROM zone  WHERE id = $1;
`;

const selectByZoneBool1 = `
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
   WHERE zone = $1 AND payment_status = $2 LIMIT $3 OFFSET $4;
`;

const selectByZoneAndWorkplace = `
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
   WHERE zone = $1 AND workplace = $2 
   AND payment_status = $3 
      LIMIT $4 OFFSET $5;
`;
const insertInto = `
    INSERT INTO zone (
    zone_name,
    description
    )
    VALUES($1,$2)
    RETURNING *;
`;

const updateQuery = `
    UPDATE zone 
    SET 
        zone_name = $1,
        description = $2
    WHERE id = $3
    RETURNING *;
`;

const selectByPayment = `
      SELECT z.zone_name, SUM(p.payment_amount) AS total_amount
        FROM payment AS p
          JOIN zone AS z ON p.zone_id = z.id
            GROUP BY z.zone_name;

`;

const selectByZonePaymentMonth = `
SELECT z.zone_name, SUM(p.payment_amount) AS total_amount
  FROM payment AS p
    JOIN zone AS z ON p.zone_id = z.id
      WHERE DATE_TRUNC('month', p.payment_date) = DATE_TRUNC('month', CURRENT_DATE)
        GROUP BY z.zone_name;
`;

const selectByZoneUsersCounts = `
      SELECT z.zone_name, COUNT(u.id) AS user_count
      FROM zone AS z
      LEFT JOIN users AS u ON z.id = u.zone
      GROUP BY z.zone_name;
    `;
const selectByNotPayedAllUsers = `
  SELECT 
    z.zone_name, 
    COUNT(p.id) AS paid_users_count
      FROM payment AS p
        JOIN zone AS z ON p.zone_id = z.id
          WHERE p.payment_amount = 0
            GROUP BY z.zone_name;
`;
const getAll = async () => {
  try {
    const res = await pool.query(selectQuery);
    return res.rows;
  } catch (e) {
    console.error("Error executing query in getAll", e.message);
  }
};

const getByIdZones = async (id) => {
  try {
    const res = await pool.query(selectByIdQuery, [id]);
    return res.rows;
  } catch (e) {
    console.error("Error executing query in getById", e.message);
  }
};

const getByName = async (zone_name) => {
  try {
    const res = await pool.query(selectByName, [zone_name]);
    return res.rows;
  } catch (e) {
    console.error("Error executing query in getByName", e.message);
  }
};

const getByZoneBool = async (id, type, page = 1, limit = 200) => {
  const offset = (page - 1) * limit;

  try {
    const res = await pool.query(selectByZoneBool1, [id, type, limit, offset]);
    return res.rows;
  } catch (e) {
    console.error("Error executing query in getByZoneBool", e.message);
  }
};

const getByZoneAndWorkplace = async (
  zone_id,
  workplace_id,
  type,
  page = 1,
  limit = 200
) => {
  const offset = (page - 1) * limit;

  try {
    const res = await pool.query(selectByZoneAndWorkplace, [
      zone_id,
      workplace_id,
      type,
      limit,
      offset,
    ]);
    return res.rows;
  } catch (e) {
    console.error("Error executing query in getByZoneAndWorkplace", e.message);
  }
};
const createZone = async (zone_name, description) => {
  zone_name = zone_name.toLowerCase();
  try {
    const res = await pool.query(insertInto, [zone_name, description]);
    return res.rows[0];
  } catch (e) {
    console.error("Error executing query in createZone", e.message);
  }
};
const updatedZone = async (id, zone_name, description) => {
  zone_name = zone_name.toLowerCase();

  try {
    const res = await pool.query(updateQuery, [zone_name, description, id]);
    return res.rows;
  } catch (e) {
    console.error("Error executing query by updatedZone", e.message);
  }
};
//jami pul
const getByZoneAmount = async () => {
  try {
    const res = await pool.query(selectByPayment);
    return res.rows;
  } catch (e) {
    console.error("Error executing query by getByZoneAmount", e.message);
  }
};

//bu oy pul to'lagan
const getByZoneMonth = async () => {
  try {
    const res = await pool.query(selectByZonePaymentMonth);
    return res.rows;
  } catch (e) {
    console.error("Error executing query by getByZoneMonth", e.message);
  }
};

//hammasini soni zonelar bo'yicha
const getByZoneUsersCount = async () => {
  try {
    const res = await pool.query(selectByZoneUsersCounts);
    return res.rows;
  } catch (e) {
    console.error("Error executing query by getByZoneUsersCount", e.message);
  }
};

//to'lamaganlar soni
const getByZoneUsersNotPayed = async () => {
  try {
    const res = await pool.query(selectByNotPayedAllUsers);
    return res.rows;
  } catch (e) {
    console.error("Error executing query by getByZoneUsersNotPayed", e.message);
  }
};

/*
const filterZone = async (zone, page = 1, limit = 200) => {
  const offset = (page - 1) * limit;

  try {
    const res = await pool.query(filter, [zone, limit, offset]);
    return res.rows;
  } catch (e) {
    console.error("Error executing query by filterZone", e.message);
  }
};*/
module.exports = {
  getAll,
  getByName,
  createZone,
  getByIdZones,
  updatedZone,
  getByZoneBool,
  getByZoneMonth,
  getByZoneAmount,
  getByZoneUsersCount,
  getByZoneAndWorkplace,
  getByZoneUsersNotPayed,
};
