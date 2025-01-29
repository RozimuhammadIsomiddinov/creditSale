const pool = require("../config/dbconfig");

const createPaymentsTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS payments (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      collector VARCHAR(200) NOT NULL REFERENCES collector(collector_name) ON DELETE CASCADE,
      payment_month VARCHAR(50) NOT NULL,  --qaysi oy uchun qilgan to'lovi
      payment_amount NUMERIC(20, 2) NOT NULL,   -- qancha to'lov qilgan
      payment_date TIMESTAMP DEFAULT NOW(),  --qachon to'lov qilgan
      description VARCHAR(500)
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
