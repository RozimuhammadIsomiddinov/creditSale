const pool = require("../../config/dbconfig");

const selectByZone = `
 SELECT u.id, u.name, u.product_name, u.cost, 
       u.phone_number, u.phone_number2, u.workplace,
       u.payment, u.given_day
FROM users AS u 
JOIN zone AS z ON z.id = u.zone
WHERE u.zone = $1;

`;

const selectZone = async (zone_name) => {
  try {
    const res = await pool.query(selectByZone, [zone_name]);
    return res.rows;
  } catch (e) {
    console.error("Error executing query in selectzone", e.message);
  }
};

module.exports = { selectZone };
