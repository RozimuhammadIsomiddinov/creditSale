const pool = require("../../config/dbconfig");

const selectByZone = `
    SELECT id,  name,   product_name,   cost,
            phone_number,   phone_number2,  workplace,
            payment,    given_day
            FROM users AS u WHERE zone = $1;
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
