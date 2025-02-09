const pool = require("../../config/dbconfig");

const selectQuery = `
    SELECT *FROM collector;
`;

const selectByIdQuery = `
    SELECT *FROM collector WHERE id = $1;
`;
const selectByName = `
SELECT *FROM collector WHERE collector_name ILIKE $1;
`;

const insertInto = `
    INSERT INTO collector (
    collector_name,
    description
    )
    VALUES ($1,$2)
    RETURNING *;

`;

const updateQuery = `
    UPDATE collector 
        SET 
            collector_name =$1,
            description = $2
        WHERE id =$3
        RETURNING *;
`;

const collectByCollectorQuery = `
    SELECT 
        c.collector_name, 
        SUM(p.payment_amount) AS total_collected
    FROM payments p
    JOIN collector c ON p.collector = c.collector_name
    WHERE p.payment_date >= NOW() - INTERVAL '30 days'
    GROUP BY c.collector_name
    ORDER BY total_collected DESC;
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
    console.error("Error executing query in getbyid", e.message);
  }
};

const getByNameCollector = async (name) => {
  if (!name || typeof name !== "string") {
    throw new Error("Invalid collector name");
  }
  try {
    const res = await pool.query(selectByName, [name]);
    return res.rows;
  } catch (e) {
    console.error("Error executing query in getByNameCollector", e.message);
    throw e;
  }
};
const createCollector = async (data) => {
  const { collector_name, description } = data;
  try {
    const res = await pool.query(insertInto, [collector_name, description]);
    return res.rows[0];
  } catch (e) {
    console.error("Error executing query in getcreatecollector", e.message);
  }
};

const updatedCollector = async (data) => {
  const { id, collector_name, description } = data;
  try {
    const res = await pool.query(updateQuery, [
      collector_name,
      description,
      id,
    ]);
    return res.rows;
  } catch (e) {
    console.error("Error executing query in getupdatedCollector", e.message);
  }
};

const collectByCollector = async () => {
  try {
    const res = await pool.query(collectByCollectorQuery);
    return res.rows;
  } catch (e) {
    console.error("Error executing query in collectbycollector", e.message);
  }
};

module.exports = {
  getAll,
  getById,
  getByNameCollector,
  createCollector,
  updatedCollector,
  collectByCollector,
};
