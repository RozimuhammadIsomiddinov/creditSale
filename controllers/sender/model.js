const pool = require("../../config/dbconfig");

const selectByZone = `
 SELECT u.id, u.name, u.product_name, u.cost, 
       u.phone_number, u.phone_number2, u.zone AS zone_name, u.workplace AS workplace_name,
       u.payment, u.given_day
FROM users AS u 
JOIN zone AS z ON u.id = z.zone
JOIN workplace AS w ON u.id = w.workplace
WHERE z.zone_name ILIKE $1;

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
