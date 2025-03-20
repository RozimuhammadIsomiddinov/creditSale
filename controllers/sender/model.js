const pool = require("../../config/dbconfig");

const selectByZone = `
SELECT 
    u.id, 
    u.name, 
    u.product_name, 
    u.cost, 
    u.phone_number, 
    u.phone_number2,  
    w.workplace_name,
    u.payment, 
    u.given_day,
    COALESCE(p.payment_amount, 0) AS last_payment_amount,
    p.payment_date AS last_payment_date
FROM users AS u
JOIN zone AS z ON u.zone = z.id
JOIN workplace AS w ON u.workplace = w.id
LEFT JOIN (
    SELECT user_id, SUM(payment_amount) AS payment_amount, MAX(payment_date) AS payment_date
    FROM payment
    WHERE DATE_TRUNC('month', payment_date) = DATE_TRUNC('month', CURRENT_DATE)
    GROUP BY user_id
) p ON u.id = p.user_id
WHERE z.zone_name ILIKE $1 ORDER BY(u.id);
`;

const selectAllZoneQuery = `
  SELECT 
    u.id, 
    u.name, 
    z.zone_name, 
    u.product_name, 
    u.cost, 
    u.phone_number, 
    u.phone_number2, 
    w.workplace_name,
    u.payment, 
    u.given_day,
    COALESCE(p.payment_amount, 0) AS last_payment_amount,
    p.payment_date AS last_payment_date
FROM users AS u
JOIN zone AS z ON u.zone = z.id
JOIN workplace AS w ON u.workplace = w.id
LEFT JOIN (
    SELECT user_id, SUM(payment_amount) AS payment_amount, MAX(payment_date) AS payment_date
    FROM payment
    WHERE DATE_TRUNC('month', payment_date) = DATE_TRUNC('month', CURRENT_DATE)
    GROUP BY user_id
) p ON u.id = p.user_id
 ORDER BY(u.id);
`;
const selectZone = async (zone_name) => {
  try {
    const res = await pool.query(selectByZone, [zone_name]);
    return res.rows;
  } catch (e) {
    console.error("Error executing query in selectzone", e.message);
  }
};

const selectAllZone = async () => {
  try {
    const res = await pool.query(selectAllZoneQuery);
    return res.rows;
  } catch (e) {
    console.error("Error executing query in selectAllZone", e.message);
  }
};
module.exports = { selectZone, selectAllZone };
