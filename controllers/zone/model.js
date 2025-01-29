const pool = require("../../config/dbconfig");

const selectQuery = `
    SELECT *FROM zone;
`;

const selectByIdQuery = `
        SELECT *FROM zone  WHERE id = $1;
`;
const selectByName = `
      SELECT *FROM zone WHERE  zone_name ILIKE $1;
`;
const insertInto = `
    INSERT INTO zone (
    zone_name,
    description
    )
    VALUES($1,$2)
    RETURNING *;
`;

const updateQuery = `
    UPDATE zone 
    SET 
        zone_name = $1,
        description = $2
    WHERE id = $3
    RETURNING *;
`;

const getAll = async () => {
  try {
    const res = await pool.query(selectQuery);
    return res.rows;
  } catch (e) {
    console.error("Error executing query in getAll", e.message);
  }
};

const getById = async (id) => {
  try {
    const res = await pool.query(selectByIdQuery, [id]);
    return res.rows;
  } catch (e) {
    console.error("Error executing query in getById", e.message);
  }
};

const getByName = async (zone_name) => {
  try {
    const res = await pool.query(selectByName, [zone_name]);
    return res.rows;
  } catch (e) {
    console.error("Error executing query in getByName", e.message);
  }
};
const createZone = async (data) => {
  const { zone_name, description } = data;
  try {
    const res = await pool.query(insertInto, [zone_name, description]);
    return res.rows[0];
  } catch (e) {
    console.error("Error executing query in createZone", e.message);
  }
};
const updatedZone = async (data) => {
  const { id, zone_name, description } = data;
  try {
    const res = await pool.query(updateQuery, [zone_name, description, id]);
    return res.rows;
  } catch (e) {
    console.error("Error executing query by updatedZone", e.message);
  }
};
module.exports = { getAll, getById, getByName, createZone, updatedZone };
