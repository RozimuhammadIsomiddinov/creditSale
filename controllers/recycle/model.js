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
WITH latest_payment AS (
  SELECT 
    p.user_id, 
    p.payment_amount, 
    p.payment_date
  FROM payment p
  JOIN (
    SELECT user_id, MAX(payment_date) AS max_date
    FROM payment
    GROUP BY user_id
  ) mp ON p.user_id = mp.user_id AND p.payment_date = mp.max_date
)
SELECT 
  u.id,
  u.name,
  u.product_name,
  u.cost,
  u.phone_number,
  u.phone_number2,
  u.time,
  u.seller,
  z.zone_name AS zone_name,  
  w.workplace_name AS workplace_name, 
  u.payment_status,
  u.monthly_income,
  u.payment,
  u.passport_series,
  u.description,
  u.given_day,
  u.recycle,
  u.updatedat,
  COALESCE(lp.payment_amount, 0) AS last_payment_amount,
  lp.payment_date AS last_payment_date
FROM users u
JOIN zone z ON u.zone = z.id
JOIN workplace w ON u.workplace = w.id
LEFT JOIN latest_payment lp ON lp.user_id = u.id
WHERE u.recycle = true
ORDER BY u.updatedat DESC;
`;
const select_paid_usersQuery = `
WITH latest_payment AS (
  SELECT 
    p.user_id, 
    p.payment_amount, 
    p.payment_date
  FROM payment p
  JOIN (
    SELECT user_id, MAX(payment_date) AS max_date
    FROM payment
    GROUP BY user_id
  ) mp ON p.user_id = mp.user_id AND p.payment_date = mp.max_date
)
SELECT 
  u.id,
  u.name,
  u.product_name,
  u.cost,
  u.phone_number,
  u.phone_number2,
  u.time,
  u.seller,
  z.zone_name AS zone_name,  
  w.workplace_name AS workplace_name, 
  u.payment_status,
  u.monthly_income,
  u.payment,
  u.passport_series,
  u.description,
  u.given_day,
  u.recycle,
  u.updatedat,
  COALESCE(lp.payment_amount, 0) AS last_payment_amount,
  lp.payment_date AS last_payment_date
FROM users u
JOIN zone z ON u.zone = z.id
JOIN workplace w ON u.workplace = w.id
LEFT JOIN latest_payment lp ON lp.user_id = u.id
WHERE u.payment >= u.cost AND u.recycle = false
ORDER BY u.updatedat DESC;
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
