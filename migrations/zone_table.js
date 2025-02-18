const pool = require("../config/dbconfig");

const createZoneTable = async () => {
  const query = `
      CREATE TABLE IF NOT EXISTS zone(
      id SERIAL PRIMARY KEY,
      zone_name VARCHAR(200),
      description VARCHAR(500),
      createdat TIMESTAMP DEFAULT NOW()
      )
      `;
  try {
    await pool.query(query);
    console.log('Table "zone" created successfully!');
  } catch (e) {
    console.error('Error dropping "zone" table:', e.message);
  }
};

const dropZoneTable = async () => {
  const query = `
      DROP TABLE IF EXISTS zone;
      `;
  try {
    await pool.query(query);
    console.log('Table "zone" deleted successfully!');
  } catch (e) {
    console.error("Error dropping table:", e.message);
  }
};

module.exports = {
  createZoneTable,
  dropZoneTable,
};
