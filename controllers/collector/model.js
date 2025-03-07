const pool = require("../../config/dbconfig");
const bcrypt = require("bcryptjs");

const selectQuery = `
    SELECT id, login, createdat FROM collector;
`;

const selectByIdQuery = `
    SELECT *FROM collector WHERE id = $1;
`;
const selectByName = `
    SELECT * FROM collector WHERE login = $1;
`;

const insertInto = `
    INSERT INTO collector(
    login,
    password
    )
    VALUES($1,$2)
    RETURNING*;

`;

const collectByCollectorQuery = `
     SELECT 
    z.zone_name, 
    c.login,
    c.id,
    DATE_TRUNC('month', p.payment_date) AS month,
    SUM(p.payment_amount) AS total_collected,
    COUNT(*) AS total_payments  -- Nechta to'lov qilinganligi
FROM payment p
JOIN collector c ON p.collector_id = c.id
JOIN zone z ON p.zone_id = z.id
WHERE p.payment_date >= DATE_TRUNC('month', NOW())
GROUP BY z.zone_name, c.login, c.id, month
ORDER BY month DESC, total_collected DESC;
`;
const collectorByCollectDay = `
SELECT 
    z.zone_name, 
    c.login,
    c.id,
    DATE_TRUNC('day', p.payment_date) AS day, -- Bugungi kunni olish
    SUM(p.payment_amount) AS total_collected,
    COUNT(*) AS total_payments  -- Nechta to'lov qilinganligi
FROM payment p
JOIN collector c ON p.collector_id = c.id
JOIN zone z ON p.zone_id = z.id
WHERE DATE(p.payment_date) = CURRENT_DATE  -- Faqat bugungi sana bilan mos keladigan tolovlar
GROUP BY z.zone_name, c.login, c.id, day
ORDER BY day DESC, total_collected DESC;

`;
const collectByCollectorIDquery = `
 SELECT 
        z.zone_name, 
        c.login,
        c.id,
        DATE_TRUNC('day', p.payment_date) AS day, -- Bugungi kunni olish
        SUM(p.payment_amount) AS total_collected,
        COUNT(*) AS total_payments  -- Nechta to'lov qilinganligi
    FROM payment p
    JOIN collector c ON p.collector_id = c.id
    JOIN zone z ON p.zone_id = z.id
    WHERE p.payment_date = CURRENT_DATE  -- Bugungi kunga tegishli tolovlar
    AND c.id = $1
    GROUP BY z.zone_name, c.login, c.id, day
    ORDER BY day DESC, total_collected DESC;
`;
const thisMonthCollect = `
    SELECT
    zone.zone_name AS zon_name,
    collector.login,
    SUM(payment.payment_amount) AS total_payment
FROM
    payment
JOIN
    collector ON payment.collector_id = collector.id
JOIN
    zone ON payment.zone_id = zone.id  -- zone jadvalini qo'shish
WHERE
    payment.payment_date >= date_trunc('month', CURRENT_DATE)  -- Joriy oyning boshidan
    AND payment.payment_date < date_trunc('month', CURRENT_DATE + INTERVAL '1 month')  -- Kelgusi oydan oldin
    AND collector.id = $1
GROUP BY
    zone.zone_name, collector.login
ORDER BY
    total_payment DESC;
`;
//vaqtga qarab hisoblaydi
const oldMOnthCollect = `
  SELECT
    zone.zone_name AS zon_name,
    collector.login,
    SUM(payment.payment_amount) AS total_payment
FROM
    payment
JOIN
    collector ON payment.collector_id = collector.id
JOIN
    zone ON payment.zone_id = zone.id  -- zone jadvalini qo'shish
WHERE
    payment.payment_date >= date_trunc('month', CURRENT_DATE - INTERVAL '1 month')  -- O'tgan oyning boshlanishi
    AND payment.payment_date < date_trunc('month', CURRENT_DATE)  -- Joriy oyning boshlanishi
    AND collector.id = $1
GROUP BY
    zone.zone_name, collector.id, collector.login  -- zone_name ham GROUP BY ga qo'shildi
ORDER BY
    total_payment DESC;

`;

const getThisMonthByID = async (id) => {
  try {
    const { rowCount, rows } = await pool.query(thisMonthCollect, [id]);
    return { rowCount, rows };
  } catch (e) {
    console.error("Error executing query in getThisMonth", e.message);
  }
};

const getOldMonthByID = async (id) => {
  try {
    const { rowCount, rows } = await pool.query(oldMOnthCollect, [id]);
    return { rowCount, rows };
  } catch (e) {
    console.error("Error executing query in getOldMonth", e.message);
  }
};
const getAll = async () => {
  try {
    const res = await pool.query(selectQuery);
    return res.rows;
  } catch (e) {
    console.error("Error executing query in getAll", e.message);
  }
};

const getByIdCollector = async (id) => {
  try {
    const res = await pool.query(selectByIdQuery, [id]);
    return res.rows;
  } catch (e) {
    console.error("Error executing query in getbyid", e.message);
  }
};

const getByNameCollector = async (login) => {
  try {
    const res = await pool.query(selectByName, [login]);
    return res.rows;
  } catch (e) {
    console.error("Error executing query in getByNameCollector", e.message);
    throw e;
  }
};

const collectByCollector = async () => {
  try {
    const res = await pool.query(collectByCollectorQuery);
    return res.rows;
  } catch (e) {
    console.error("Error executing query in collectbycollector", e.message);
  }
};

const collectByCollectorDay = async () => {
  try {
    const res = await pool.query(collectorByCollectDay);
    return res.rows;
  } catch (e) {
    console.error("Error executing query in collectByCollectorDay", e.message);
  }
};

const collectByCollectorID = async (id) => {
  try {
    const res = await pool.query(collectByCollectorIDquery, [id]);
    return res.rows;
  } catch (e) {
    console.error("Error executing query in collectByCollectorID", e.message);
  }
};
const createCollector = async () => {
  const collectors = [
    { login: "aziz", password: "aziz70" },
    { login: "laziz", password: "laziz70" },
    { login: "ahmad", password: "ahmad70" },
  ];

  try {
    for (const collector of collectors) {
      const { login, password } = collector;

      const checkCollector = await pool.query(selectByName, [login]);

      if (checkCollector.rows.length > 0) {
        // console.log(`Collector ${login} allaqachon mavjud.`);
        continue;
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      await pool.query(insertInto, [login, hashedPassword]);

      console.log(`collector ${login} yaratildi.`);
    }
  } catch (e) {
    console.error("Xatolik createCollector: " + e.message);
  }
};

createCollector();
module.exports = {
  getAll,
  getOldMonthByID,
  getThisMonthByID,
  getByIdCollector,
  getByNameCollector,
  collectByCollector,
  collectByCollectorDay,
  collectByCollectorID,
};
