const pool = require("../config/dbconfig");

const createAdminTable = async () => {
  const query = `
      CREATE TABLE IF NOT EXISTS admin(
      id SERIAL ,
      name VARCHAR(50) NOT NULL,
      password VARCHAR(255) NOT NULL,
      createdat TIMESTAMP DEFAULT NOW()
      )
      `;
  try {
    await pool.query(query);
    console.log('Table "admin" created successfully!');
  } catch (e) {
    console.error('Error dropping "admin" table:', e.message);
  }
};

const dropAdminTable = async () => {
  const query = `
      DROP TABLE IF EXISTS admin;
      `;
  try {
    await pool.query(query);
    console.log('Table "collector" deleted successfully!');
  } catch (e) {
    console.error("Error dropping table:", e.message);
  }
};

module.exports = {
  createAdminTable,
  dropAdminTable,
};
