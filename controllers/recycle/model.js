const pool = require("../../config/dbconfig");

const to_recycleQuery = `
UPDATE users
SET recycle = CASE 
    WHEN recycle = false THEN true 
    ELSE recycle 
END
WHERE id = $1
RETURNING *;

`;

const out_recycleQuery = `
 UPDATE users
SET recycle = CASE 
    WHEN recycle = true THEN false 
    ELSE recycle 
END
WHERE id = $1
RETURNING *;
`;

const to_recycle = async (id) => {
  try {
    const { rows } = await pool.query(to_recycleQuery, [id]);
    return rows;
  } catch (e) {
    console.error("Error executing query in to_recycle", e.message);
  }
};

const out_recycle = async (id) => {
  try {
    const { rows } = await pool.query(out_recycleQuery, [id]);
    return rows;
  } catch (e) {
    console.error("Error executing query in out_recycle", e.message);
  }
};

module.exports = { to_recycle, out_recycle };
