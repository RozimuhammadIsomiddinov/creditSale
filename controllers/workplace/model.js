const pool = require("../../config/dbconfig");

const selectQuery = `
    SELECT *FROM workplace;
`;

const selectByIdQuery = `
        SELECT *FROM workplace  WHERE id = $1;
`;
const insertInto = `
    INSERT INTO workplace (
    workplace_name,
    description
    )
    VALUES($1,$2)
    RETURNING *;
`;

const updateQuery = `
    UPDATE workplace    
    SET 
        workplace_name = $1,
        description = $2
    WHERE id = $3
    RETURNING *;
`;

const getAllWorkplace = async () => {
  try {
    const res = await pool.query(selectQuery);
    return res.rows;
  } catch (e) {
    console.error("Error executing query in getAll", e.message);
  }
};

const getByIdWorkplace = async (id) => {
  try {
    const res = await pool.query(selectByIdQuery, [id]);
    return res.rows;
  } catch (e) {
    console.error("Error executing query in getById", e.message);
  }
};

const createWorkplace = async (workplace_name, description) => {
  workplace_name = workplace_name.toLowerCase();
  try {
    const res = await pool.query(insertInto, [workplace_name, description]);
    return res.rows[0];
  } catch (e) {
    console.error("Error executing query in createWorkplace", e.message);
  }
};

const updatedWorkplace = async (id, workplace_name, description) => {
  workplace_name = workplace_name.toLowerCase();
  try {
    const res = await pool.query(updateQuery, [
      workplace_name,
      description,
      id,
    ]);
    return res.rows;
  } catch (e) {
    console.error("Error executing query by updatedWorkplace", e.message);
  }
};

module.exports = {
  getAllWorkplace,
  getByIdWorkplace,
  createWorkplace,
  updatedWorkplace,
};
