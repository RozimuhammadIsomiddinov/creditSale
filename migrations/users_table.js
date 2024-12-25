const pool = require("../config/dbconfig");

const createUsersTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name VARCHAR(50) NOT NULL,
      product_name VARCHAR(50) NOT NULL,
      cost INTEGER NOT NULL,
      phone_number VARCHAR(14) NOT NULL,
      phone_number2 VARCHAR(14),
      address VARCHAR(200) NOT NULL,
      workplace VARCHAR(200),
      time INTEGER,
      primary_payment INTEGER,
      payment_status BOOLEAN DEFAULT TRUE, 
      passport_series VARCHAR(20),
      description TEXT,
      given_day TIMESTAMP DEFAULT NOW(), 
      monthly_income FLOAT,
      payment INTEGER DEFAULT 0,
      updatedAt TIMESTAMP DEFAULT NOW()
    );
  `;
  try {
    await pool.query(query);
    console.log('Table "users" created successfully!');
  } catch (err) {
    console.error('Error dropping "users" table:', err.message);
  }
};

const dropUsersTable = async () => {
  const query = `
    DROP TABLE IF EXISTS users;
  `;
  try {
    await pool.query(query);
    console.log('Table "users" deleted successfully!');
  } catch (err) {
    console.error("Error dropping table:", err.message);
  }
};

module.exports = {
  createUsersTable,
  dropUsersTable,
};
