const { getById } = require("../users/model");
const { to_recycle, out_recycle } = require("./model");

const put_recycle = async (req, res) => {
  const { id } = req.params;
  try {
    const result1 = await getById(id);
    if (!result1) return res.status(404).json({ message: "user not found" });

    const result = await to_recycle(id);
    return res.status(200).json(result);
  } catch (e) {
    res
      .status(500)
      .json({ message: "Error from put_recycle", error: e.message });
  }
};

const delete_recycle = async (req, res) => {
  const { id } = req.params;
  try {
    const result1 = await getById(id);
    if (!result1) return res.status(404).json({ message: "user not found" });

    const result = await out_recycle(id);
    return res.status(200).json(result);
  } catch (e) {
    res
      .status(500)
      .json({ message: "Error from delete_recycle", error: e.message });
  }
};

module.exports = { put_recycle, delete_recycle };
