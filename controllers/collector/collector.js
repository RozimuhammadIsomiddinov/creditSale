const {
  getAll,
  getById,
  createCollector,
  updatedCollector,
  collectByCollector,
} = require("./model");

const getAllCollector = async (req, res) => {
  try {
    const result = await getAll();
    if (result.length == 0) {
      return res.status(404).json({ message: "Collectors have not yet!" });
    }
    res.status(200).json(result);
  } catch (e) {
    res
      .status(400)
      .json({ message: "Error from getAllCollector", error: e.message });
  }
};

const getByIdCollector = async (req, res) => {
  const { id } = req.params;
  if (!id) return res.status(400).json({ message: "please send user's id" });
  try {
    const result = await getById(id);

    if (result.length == 0)
      return res.status(404).json({ message: "Collector has not" });

    res.status(200).json(result[0]);
  } catch (e) {
    res
      .status(400)
      .json({ message: "Error from getByIdCollector", error: e.message });
  }
};

const addCollector = async (req, res) => {
  const { collector_name, description } = req.body;
  if (!collector_name)
    return res
      .status(400)
      .json({ message: "Please provide  required collector_name." });
  try {
    const result = await createCollector(req.body);
    return res.status(201).json({
      message: "Collector added successfully!",
      collector: result ? result : "collector doesn't saved",
    });
  } catch (e) {
    res
      .status(400)
      .json({ message: "Error from addCollector", error: e.message });
  }
};

const updateCollector = async (req, res) => {
  const { id } = req.params;
  if (!id) return res.status(400).json({ message: "please send user's id" });
  const { collector_name, description } = req.body;
  if (!collector_name)
    return res
      .status(400)
      .json({ message: "Please provide  required collector_name." });
  try {
    const result1 = await getById(id);
    if (result1.length == 0)
      return res.status(404).json({ message: "Collector has not" });
    const result = await updatedCollector({ id, collector_name, description });
    return res.status(201).json({
      message: "collector updated successfully!",
      result,
    });
  } catch (e) {
    res
      .status(400)
      .json({ message: "Error from updateCollector", error: e.message });
  }
};

const getCollectorMoney = async (req, res) => {
  try {
    const result = await collectByCollector();
    return res.status(200).json({ result });
  } catch (e) {
    res
      .status(400)
      .json({ message: "Error from getCollectorMoney", error: e.message });
  }
};
module.exports = {
  getAllCollector,
  getByIdCollector,
  addCollector,
  updateCollector,
  getCollectorMoney,
};
