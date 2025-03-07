const pool = require("../../config/dbconfig");

const selectByZone = `
 SELECT 
    u.id, 
    u.name, 
    u.product_name, 
    u.cost, 
    u.phone_number, 
    u.phone_number2, 
    z.zone_name, 
    w.workplace_name,
    u.payment, 
    u.given_day
FROM users AS u
JOIN zone AS z ON u.zone = z.id
JOIN workplace AS w ON u.workplace = w.id
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
