const pool = require("../../config/dbconfig");
//1.
//hamma pul
const allMoneyQuery = `
    SELECT SUM(cost) FROM users;
`;
//nechta userga sotilgan
const allCountQuery = `
    SELECT COUNT(*) FROM users;
`;

//to'laganlar
const payedUsersMoneyQuery = `
    SELECT SUM(payment) FROM users;
`;

//to'lagan userlar
const payedUsersCountQuery = `
    SELECT COUNT(*) FROM users WHERE payment != 0; 
`;

//2.
//bu oy to'lamaganlar  yani qancha to'lanishi kerak
const selectNotPayedUsersQuery = `
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
   WHERE payment_status = false LIMIT $1 OFFSET $2;
`;

//bu oy to'lamagan userlar soni
const notPayedUsersQuery = `
    SELECT COUNT(*) FROM users WHERE payment_status = false;
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
const selectMonthQuery = `
SELECT DISTINCT ON (u.id)
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
    AND p.payment_date >= DATE_TRUNC('month', CURRENT_DATE) 
    AND p.payment_date < DATE_TRUNC('month', CURRENT_DATE) + INTERVAL '1 month'
    ORDER BY p.payment_date DESC 
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
    COALESCE(p.payment_amount, 0) AS last_payment_amount,
    p.payment_date AS last_payment_date
FROM users u
JOIN zone z ON u.zone = z.id
JOIN workplace w ON u.workplace = w.id
LEFT JOIN LATERAL (
    SELECT p.payment_amount, p.payment_date 
    FROM payment p 
    WHERE p.user_id = u.id 
    AND DATE(p.payment_date) >= DATE_TRUNC('month', CURRENT_DATE)  -- Sana faqat yil-oy-kun formatida tekshiriladi
    ORDER BY p.payment_date DESC 
    LIMIT 1
) p ON true
WHERE u.payment_status = true
ORDER BY u.id, u.updatedat DESC;

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
