const {
  getThisMonthByID,
  getByIdCollector,
  getOldMonthByID,
} = require("../model");

const selectThisOldMonthByID = async (req, res) => {
  const { id } = req.params;
  if (!id) return res.status(400).json({ message: "send a collector id" });
  try {
    const result1 = await getByIdCollector(id);
    if (!result1)
      return res.status(404).json({ message: "collector not found" });

    const result = await getThisMonthByID(id);
    const result2 = await getOldMonthByID(id);
    console.log({ this_month: result, old_month: result2 });
    return res.status(200).json({ this_month: result, old_month: result2 });
  } catch (e) {
    res
      .status(500)
      .json({ message: "Error from selectThisMonth", error: e.message });
  }
};

module.exports = { selectThisOldMonthByID };
