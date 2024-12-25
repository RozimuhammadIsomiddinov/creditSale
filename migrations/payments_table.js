const pool = require("../config/dbconfig");

const createPaymentsTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS payments (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      payment_amount FLOAT NOT NULL, -- Foydalanuvchi qancha to'lagan
      payment_date TIMESTAMP DEFAULT NOW(), -- To'lov sanasi
      description TEXT
    ); 
  `;
  try {
    await pool.query(query);
    console.log('Table "payments" created successfully!');
  } catch (err) {
    console.error("Error creating 'payments' table:", err.message);
  }
};

const dropPaymentsTable = async () => {
  const query = `
    DROP TABLE IF EXISTS payments;
  `;
  try {
    await pool.query(query);
    console.log('Table "payments" deleted successfully!');
  } catch (err) {
    console.error("Error dropping'payments' table:", err.message);
  }
};

module.exports = { createPaymentsTable, dropPaymentsTable };
