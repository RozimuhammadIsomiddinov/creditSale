const pool = require("../config/dbconfig");

const createReturnsTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS returns(
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    product_name VARCHAR(50) NOT NULL,
    createdat TIMESTAMP DEFAULT NOW()
    )
    `;
  try {
    await pool.query(query);
    console.log('Table "returns" created successfully!');
  } catch (e) {
    console.error('Error dropping "returns" table:', e.message);
  }
};

const dropReturnsTable = async () => {
  const query = `
    DROP TABLE IF EXISTS returns;
    `;
  try {
    await pool.query(query);
    console.log('Table "returns" deleted successfully!');
  } catch (e) {
    console.error("Error dropping table:", e.message);
  }
};

module.exports = {
  createReturnsTable,
  dropReturnsTable,
};
