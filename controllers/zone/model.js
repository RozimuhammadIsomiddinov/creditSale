const pool = require("../../config/dbconfig");

const selectQuery = `
    SELECT *FROM zone;
`;

const selectByIdQuery = `
        SELECT *FROM zone  WHERE id = $1;
`;

const selectByCollectorStats = `
  WITH last_payments AS (
    SELECT DISTINCT ON (user_id) 
        user_id, 
        payment_amount, 
        payment_date
    FROM payment
    ORDER BY user_id, payment_date DESC
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
    z.zone_name,  
    w.workplace_name, 
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
LEFT JOIN last_payments lp ON u.id = lp.user_id
WHERE EXISTS (
    SELECT 1 
    FROM payment p
    WHERE p.user_id = u.id AND p.collector_id = $1
)
LIMIT $2 OFFSET $3;

`;

const selectByZoneAndWorkplace = `
   WITH last_payments AS (
    SELECT DISTINCT ON (user_id)
        user_id,
        payment_amount,
        payment_date
    FROM payment
    ORDER BY user_id, payment_date DESC
),
filtered_users AS (
    SELECT u.*
    FROM users u
    JOIN zone z ON u.zone = z.id
    JOIN workplace w ON u.workplace = w.id
    WHERE z.id = $2
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
    z.zone_name,  
    w.workplace_name, 
    u.payment_status,
    u.monthly_income,
    u.payment,
    u.passport_series,
    u.description,
    u.given_day,
    u.updatedat,
    COALESCE(lp.payment_amount, 0) AS last_payment_amount,
    lp.payment_date AS last_payment_date
FROM filtered_users u
JOIN zone z ON u.zone = z.id
JOIN workplace w ON u.workplace = w.id
JOIN payment pay ON pay.user_id = u.id
JOIN collector c ON pay.collector_id = c.id
LEFT JOIN last_payments lp ON u.id = lp.user_id
WHERE pay.payment_date >= DATE_TRUNC('month', NOW())
  AND c.id = $1
LIMIT $3 OFFSET $4;

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

//har bir zone bo'yicha hamma pul
const allSumByZone = `
SELECT 
    z.id AS zone_id,
    z.zone_name,
    COALESCE(SUM(u.cost), 0) - COALESCE(SUM(p.payment_amount), 0) AS total_cost
FROM zone AS z
LEFT JOIN users AS u ON u.zone = z.id
LEFT JOIN payment AS p ON p.user_id = u.id
GROUP BY z.zone_name, z.id;
`;

//tushgan pullar
const selectByPayment = `
        SELECT z.zone_name, COALESCE(SUM(p.payment_amount), 0) AS total_amount
    FROM zone AS z
    LEFT JOIN payment AS p ON p.zone_id = z.id
    GROUP BY z.zone_name;


`;

//bu oy tushgan pullar
const selectByZonePaymentMonth = `
    SELECT z.zone_name, COALESCE(SUM(p.payment_amount), 0) AS total_amount
    FROM zone AS z
    LEFT JOIN payment AS p 
        ON p.zone_id = z.id 
        AND DATE_TRUNC('month', p.payment_date) = DATE_TRUNC('month', CURRENT_DATE)
    GROUP BY z.zone_name;

`;

//opshi soni to'lagan to'lamagan ham
const selectByZoneUsersCounts = `
      SELECT z.zone_name, COUNT(u.id) AS user_count
      FROM zone AS z
      LEFT JOIN users AS u ON z.id = u.zone
      GROUP BY z.zone_name;
    `;

//barcha zonalar natijada chiqadi, hatto hamma foydalanuvchilar to'lov qilgan bo'lsa ham
const selectByNotPayedAllUsers = `
    SELECT 
        z.zone_name, 
        COUNT(u.id) - COUNT(CASE WHEN p.payment_amount > 0 THEN u.id END) AS unpaid_users_count
    FROM zone AS z
    LEFT JOIN users AS u ON u.zone = z.id
    LEFT JOIN payment AS p ON p.user_id = u.id
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

const getByZoneBool = async (id, page = 1, limit = 2000) => {
  const offset = (page - 1) * limit;

  try {
    const res = await pool.query(selectByCollectorStats, [id, limit, offset]);
    return res.rows;
  } catch (e) {
    console.error("Error executing query in getByZoneBool", e.message);
  }
};

const getByZoneAndWorkplace = async (id, zone_id, page = 1, limit = 2000) => {
  const offset = (page - 1) * limit;

  try {
    const res = await pool.query(selectByZoneAndWorkplace, [
      id,
      zone_id,
      limit,
      offset,
    ]);
    return res.rows;
  } catch (e) {
    console.error("Error executing query in getByZoneAndWorkplace", e.message);
  }
};
const createZone = async (zone_name, description) => {
  zone_name = zone_name.toUpperCase();
  try {
    const res = await pool.query(insertInto, [zone_name, description]);
    return res.rows[0];
  } catch (e) {
    console.error("Error executing query in createZone", e.message);
  }
};
const updatedZone = async (id, zone_name, description) => {
  zone_name = zone_name.toUpperCase();

  try {
    const res = await pool.query(updateQuery, [zone_name, description, id]);
    return res.rows;
  } catch (e) {
    console.error("Error executing query by updatedZone", e.message);
  }
};
const getZoneStatistics = async () => {
  try {
    const [totalCost, totalPayments, monthlyPayments, totalUsers, unpaidUsers] =
      await Promise.all([
        pool.query(allSumByZone),
        pool.query(selectByPayment),
        pool.query(selectByZonePaymentMonth),
        pool.query(selectByZoneUsersCounts),
        pool.query(selectByNotPayedAllUsers),
      ]);

    // Natijalarni zone_name bo'yicha obyektga joylash
    const zoneStats = {};

    totalCost.rows.forEach(({ zone_id, zone_name, total_cost }) => {
      zoneStats[zone_name] = {
        zone_id,
        zone_name,
        total_cost,
        total_amount: "0",
        monthly_amount: "0",
        total_users: "0",
        unpaid_users: "0",
      };
    });

    totalPayments.rows.forEach(({ zone_name, total_amount }) => {
      if (zoneStats[zone_name])
        zoneStats[zone_name].total_amount = total_amount;
    });

    monthlyPayments.rows.forEach(({ zone_name, total_amount }) => {
      if (zoneStats[zone_name])
        zoneStats[zone_name].monthly_amount = total_amount;
    });

    totalUsers.rows.forEach(({ zone_name, user_count }) => {
      if (zoneStats[zone_name]) zoneStats[zone_name].total_users = user_count;
    });

    unpaidUsers.rows.forEach(({ zone_name, unpaid_users_count }) => {
      if (zoneStats[zone_name])
        zoneStats[zone_name].unpaid_users = unpaid_users_count;
    });

    return { zones: Object.values(zoneStats) };
  } catch (e) {
    console.error("Error executing getZoneStatistics", e.message);
    throw e;
  }
};

module.exports = {
  getAll,
  getByName,
  createZone,
  getByIdZones,
  updatedZone,
  getByZoneBool,
  getZoneStatistics,
  getByZoneAndWorkplace,
};
