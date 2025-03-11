const pool = require("../../config/dbconfig");

const to_recycleQuery = `
UPDATE users
SET recycle = CASE 
    WHEN recycle = false THEN true 
    ELSE recycle 
END
WHERE id = $1
RETURNING *;

`;

const out_recycleQuery = `
 UPDATE users
SET recycle = CASE 
    WHEN recycle = true THEN false 
    ELSE recycle 
END
WHERE id = $1
RETURNING *;
`;
const select_recycle_usersQuery = `
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
    users.recycle,
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
   WHERE users.recycle = true;
`;

const select_paid_usersQuery = `
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
    users.recycle,
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
 WHERE users.payment >= users.cost AND users.recycle = false;
`;
const select_paid_users = async () => {
  try {
    const { rows, rowCount } = await pool.query(select_paid_usersQuery);
    return { rows, rowCount };
  } catch (e) {
    console.error("Error executing query in select_paid_users", e.message);
  }
};
const to_recycle = async (id) => {
  try {
    const { rows } = await pool.query(to_recycleQuery, [id]);
    return rows;
  } catch (e) {
    console.error("Error executing query in to_recycle", e.message);
  }
};

const out_recycle = async (id) => {
  try {
    const { rows } = await pool.query(out_recycleQuery, [id]);
    return rows;
  } catch (e) {
    console.error("Error executing query in out_recycle", e.message);
  }
};

const select_recycle_users = async (params) => {
  try {
    const { rows } = await pool.query(select_recycle_usersQuery);
    return rows;
  } catch (e) {
    console.error("Error executing query in select_recycle_users", e.message);
  }
};
module.exports = {
  to_recycle,
  out_recycle,
  select_paid_users,
  select_recycle_users,
};
