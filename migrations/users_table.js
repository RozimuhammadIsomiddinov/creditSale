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
      workplace VARCHAR(200),
      time INTEGER,
      seller VARCHAR(200),
      zone VARCHAR(200) NOT NULL REFERENCES zone(zone_name) ON DELETE CASCADE,
      collector VARCHAR(200) NOT NULL REFERENCES collector(collector_name) ON DELETE CASCADE,
      payment_status BOOLEAN DEFAULT FALSE, 
      passport_series VARCHAR(20),
      description VARCHAR(500),
      given_day TIMESTAMP DEFAULT NOW(), 
      monthly_income FLOAT,
      payment INTEGER DEFAULT 0,  --qilingan to'lovni shunga qo'shaman
      updatedAt TIMESTAMP DEFAULT NOW()
    );
  `;
  //seller_name
  //zone ni shunchaki qo'shib qo'yaman
  //pul yig'uvchini ismini oldin yaratadi keyin uni alohida collector degan tablega qo'shib qo'yaman
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
