const { getAll, getCount, createReturns } = require("./model");

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
  const { product_name } = req.body;
  if (!id || !product_name)
    return res
      .status(400)
      .json({ message: "Please provide all required fields." });

  try {
    const result = await createReturns({ user_id: id, product_name });
    return res.status(201).json({
      message: "Return itme added successfully!",
      result,
    });
  } catch (e) {
    res.status(400).json({ message: "Error from addReturn", error: e.message });
  }
};

module.exports = { getAllReturns, getCountReturns, addReturn };
