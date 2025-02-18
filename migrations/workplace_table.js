const pool = require("../config/dbconfig");

const createWorkPlaceTable = async () => {
  const query = `
        CREATE TABLE IF NOt EXISTS workplace(
        id SERIAL PRIMARY KEY,
        workplace_name VARCHAR(255) NOT NULL,
        description VARCHAR(255),
        createdat TIMESTAMP DEFAULT NOW()
        );
        `;
  try {
    await pool.query(query);
    console.log('Table "workplace" created successfully!');
  } catch (e) {
    console.error('Error dropping "workpalce" table:', e.message);
  }
};

const dropWorkPlaceTable = async () => {
  const query = `
    DROP TABLE IF EXISTS workplace;`;
  try {
    await pool.query(query);
    console.log('Table "workplace" deleted successfully!');
  } catch (e) {
    console.error("Error dropping table:", e.message);
  }
};

module.exports = { createWorkPlaceTable, dropWorkPlaceTable };
