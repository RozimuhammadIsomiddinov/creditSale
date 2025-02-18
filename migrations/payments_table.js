const pool = require("../config/dbconfig");

const createPaymentsTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS payment (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      collector_id INTEGER NOT NULL REFERENCES collector(id) ON DELETE CASCADE,
      zone_id INTEGER NOT NULL REFERENCES zone(id) ON DELETE CASCADE,
      payment_month VARCHAR(50) NOT NULL, 
      payment_amount NUMERIC(20, 2) NOT NULL,  
      payment_date TIMESTAMP DEFAULT NOW(), 
      updated_at TIMESTAMP DEFAULT NOW(),
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
    DROP TABLE IF EXISTS payment;
  `;
  try {
    await pool.query(query);
    console.log('Table "payments" deleted successfully!');
  } catch (err) {
    console.error("Error dropping'payments' table:", err.message);
  }
};

module.exports = { createPaymentsTable, dropPaymentsTable };
