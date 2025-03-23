const pool = require("../config/dbconfig");

const createAdminTable = async () => {
  const query = `
      CREATE TABLE IF NOT EXISTS admin(
      id SERIAL PRIMARY KEY,
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
const create_index = async () => {
  try {
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_payment_user_id_date 
      ON payment(user_id, payment_date DESC);
    `);
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_users_zone_recycle_workplace_paymentstatus 
      ON users(zone, recycle, workplace, payment_status);
    `);
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_users_recycle_true 
      ON users(recycle);
    `);
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_users_fully_paid 
      ON users(id) 
      WHERE payment >= cost AND recycle = false;
    `);
    return "All indexes created successfully!";
  } catch (e) {
    console.error("Error creating indexes:", e.message);
  }
};

create_index().then((a) => console.log(a));
module.exports = {
  createAdminTable,
  dropAdminTable,
};
