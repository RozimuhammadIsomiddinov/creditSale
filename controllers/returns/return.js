const pool = require("../../config/dbconfig");
const {
  getAll,
  getCount,
  createReturns,
  productNameQuery,
} = require("./model");

const getAllReturns = async (req, res) => {
  const { page } = req.query;
  if (!page)
    return res.status(400).json({ message: "please send me page number" });
  try {
    const result = await getAll(page);
    if (result.length == 0) {
      return res.status(404).json({ message: "users have not yet!" });
    }
    res.status(200).json(result);
  } catch (e) {
    res
      .status(400)
      .json({ message: "Error from getAllReturns", error: e.message });
  }
};

const getCountReturns = async (req, res) => {
  try {
    const result = await getCount();
    res.status(200).json(result);
  } catch (e) {
    console.error("Error from getCountReturns", e.message);
  }
};

const addReturn = async (req, res) => {
  const { id } = req.params; //user_id
  const { product_name, reason } = req.body;
  if (!id || !product_name)
    return res
      .status(400)
      .json({ message: "Please provide all required fields." });

  try {
    const condition = await pool.query(productNameQuery, [id, product_name]);
    if (condition.rows.length === 0) {
      return res
        .status(404)
        .json({ message: "User ID yoki product_name noto'g'ri." });
    }
    const result = await createReturns({ user_id: id, product_name, reason });
    return res.status(201).json({
      message: result
        ? "Return item added successfully!"
        : "Return item doesn't add",
      result: result || "No result provided",
    });
  } catch (e) {
    res.status(400).json({ message: "Error from addReturn", error: e.message });
  }
};

module.exports = { getAllReturns, getCountReturns, addReturn };
