const pool = require("../../config/dbconfig");
//1.
//hamma pul
const allMoneyQuery = `
    SELECT SUM(cost) FROM users WHERE recycle = false;
`;
//nechta userga sotilgan
const allCountQuery = `
    SELECT COUNT(*) FROM users WHERE recycle = false;
`;

//to'laganlar
const payedUsersMoneyQuery = `
    SELECT SUM(payment) FROM users WHERE recycle = false;
`;

//to'lagan userlar
const payedUsersCountQuery = `
    SELECT COUNT(*) FROM users WHERE payment != 0 AND recycle = false; 
`;

//2.
//bu oy to'lamaganlar  yani qancha to'lanishi kerak
const selectNotPayedUsersQuery = `
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
    u.updatedat,
    COALESCE(lp.payment_amount, 0) AS last_payment_amount,
    lp.payment_date AS last_payment_date
FROM users u
JOIN zone z ON u.zone = z.id
JOIN workplace w ON u.workplace = w.id
LEFT JOIN latest_payment lp ON lp.user_id = u.id
WHERE u.payment_status = false AND  recycle = false
ORDER BY u.updatedat DESC
LIMIT $1 OFFSET $2;
`;

//bu oy to'lamagan userlar soni
const notPayedUsersQuery = `
    SELECT COUNT(*) FROM users WHERE payment_status = false AND recycle = false;
`;

//3.
//bu oy qancha to'laganlar
const sumMonthQuery = `
  SELECT SUM(payment_amount) 
FROM payment AS p
WHERE p.payment_date >= DATE_TRUNC('month', CURRENT_DATE) 
  AND p.payment_date < DATE_TRUNC('month', CURRENT_DATE) + INTERVAL '1 month';
`;

const countMonthQuery = `
 SELECT COUNT(*) 
FROM payment AS p
WHERE p.payment_date >= DATE_TRUNC('month', CURRENT_DATE) 
  AND p.payment_date < DATE_TRUNC('month', CURRENT_DATE) + INTERVAL '1 month';
`;
// bu oy to'laganlar ro'yhati
const selectMonthQuery = `SELECT DISTINCT ON (u.id)
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
    u.updatedat,
    COALESCE(p.payment_amount, 0) AS last_payment_amount,
    p.payment_date AS last_payment_date
FROM users u
JOIN zone z ON u.zone = z.id
JOIN workplace w ON u.workplace = w.id
LEFT JOIN LATERAL (
    SELECT p.payment_amount, p.payment_date 
    FROM payment p 
    WHERE p.user_id = u.id 
    ORDER BY p.payment_date DESC  -- Eng oxirgi tolovni olish
    LIMIT 1
) p ON true  
WHERE u.payment_status = true
ORDER BY u.id, u.updatedat DESC;
`;
//4.
// bugun to'laganlar
const sumDayQuery = `
    SELECT SUM(payment_amount) 
    FROM payment AS p
    WHERE DATE(p.payment_date) = CURRENT_DATE;
`;

//bugun pul nechi marta to'langan soni
const countDayQuery = `
  SELECT COUNT(*) 
    FROM payment AS p
    WHERE DATE(p.payment_date) = CURRENT_DATE;
`;
const selectDayQuery = `
WITH latest_payments AS (
    SELECT DISTINCT ON (p.user_id)
        p.user_id,
        p.payment_amount,
        p.payment_date
    FROM payment p
    WHERE p.payment_date::date = CURRENT_DATE
    ORDER BY p.user_id, p.payment_date DESC
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
    u.updatedat,
    COALESCE(lp.payment_amount, 0) AS last_payment_amount,
    lp.payment_date AS last_payment_date
FROM users u
JOIN zone z ON u.zone = z.id
JOIN workplace w ON u.workplace = w.id
JOIN latest_payments lp ON lp.user_id = u.id
WHERE u.payment_status = true
ORDER BY u.updatedat DESC, u.id;
`;
//1.
const selectIncome = async () => {
  try {
    const res = await pool.query(allMoneyQuery);
    return res.rows[0];
  } catch (e) {
    console.error("Error executing query by selectIncome", e.message);
  }
};
const selectIncomeUsers = async () => {
  try {
    const res = await pool.query(allCountQuery);
    return res.rows[0];
  } catch (e) {
    console.error("Error executing query in getincomeusers", e.message);
  }
};

const payedMoneyUsers = async () => {
  try {
    const res = await pool.query(payedUsersMoneyQuery);
    return res.rows[0];
  } catch (e) {
    console.error("Error executing query in payedUsers", e.message);
  }
};
const payedCountUsers = async () => {
  try {
    const res = await pool.query(payedUsersCountQuery);
    return res.rows[0];
  } catch (e) {
    console.error("Error executing query in payedCountUsers", e.message);
  }
};

//2.
const notPayedUsers = async (page = 1, limit = 2000) => {
  const offset = (page - 1) * limit;

  try {
    const res = await pool.query(selectNotPayedUsersQuery, [limit, offset]);
    return res.rows;
  } catch (e) {
    console.error("Error executing query in notpayedusers", e.message);
  }
};

const notPayedUsersCount = async () => {
  try {
    const res = await pool.query(notPayedUsersQuery);
    return res.rows[0];
  } catch (e) {
    console.error("Error executing query in notpayed count", e.message);
  }
};

//3.

const sumMonth = async () => {
  try {
    const res = await pool.query(sumMonthQuery);
    return res.rows[0];
  } catch (e) {
    console.error("Error executing query in summonth", e.message);
  }
};

const selectMonth = async () => {
  try {
    const { rows } = await pool.query(selectMonthQuery);

    return rows;
  } catch (e) {
    console.error("Error executing query in selectMonth", e.message);
  }
};

const countMonth = async () => {
  try {
    const res = await pool.query(countMonthQuery);
    return res.rows[0];
  } catch (e) {
    console.error("Error executing query by countMonth", e.message);
  }
};

//4.
const sumDay = async () => {
  try {
    const res = await pool.query(sumDayQuery);
    return res.rows[0];
  } catch (e) {
    console.error("Error executing query by sumday", e.message);
  }
};

const countDay = async () => {
  try {
    const res = await pool.query(countDayQuery);
    return res.rows[0];
  } catch (e) {
    console.error("Error executing query by countday", e.message);
  }
};

const selectDay = async () => {
  try {
    const { rows } = await pool.query(selectDayQuery);

    return rows;
  } catch (e) {
    console.error("Error executing query by selectday", e.message);
  }
};

module.exports = {
  selectIncome,
  selectDay,
  countDay,
  sumDay,
  countMonth,
  selectMonth,
  sumMonth,
  notPayedUsersCount,
  notPayedUsers,
  payedCountUsers,
  payedMoneyUsers,
  selectIncomeUsers,
};
