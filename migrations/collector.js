const pool = require("../config/dbconfig");

const createCollectorTable = async () => {
  const query = `
      CREATE TABLE IF NOT EXISTS collector(
      id SERIAL ,
      collector_name VARCHAR(200) UNIQUE NOT NULL PRIMARY KEY,
      description VARCHAR(500),
      createdat TIMESTAMP DEFAULT NOW()
      )
      `;
  try {
    await pool.query(query);
    console.log('Table "collector" created successfully!');
  } catch (e) {
    console.error('Error dropping "collector" table:', e.message);
  }
};

const dropCollectorTable = async () => {
  const query = `
      DROP TABLE IF EXISTS collector;
      `;
  try {
    await pool.query(query);
    console.log('Table "collector" deleted successfully!');
  } catch (e) {
    console.error("Error dropping table:", e.message);
  }
};

module.exports = {
  createCollectorTable,
  dropCollectorTable,
};
