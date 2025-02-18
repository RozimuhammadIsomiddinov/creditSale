const pool = require("../../config/dbconfig");
const bcrypt = require("bcryptjs");

const selectQuery = `
    SELECT *FROM collector;
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
        c.collector_name, 
        DATE_TRUNC('month', p.payment_date) AS month,
        SUM(p.payment_amount) AS total_collected
    FROM payments p
    JOIN collector c ON p.collector = c.collector_name
    WHERE p.payment_date >= DATE_TRUNC('month', NOW())
    GROUP BY c.collector_name, month
    ORDER BY month DESC, total_collected DESC;

`;
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
        console.log(`Collector ${login} allaqachon mavjud.`);
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
  getByIdCollector,
  getByNameCollector,
  collectByCollector,
};
