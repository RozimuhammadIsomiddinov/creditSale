const { getAll, collectByCollector, getByIdCollector } = require("./model");

const getAllCollector = async (req, res) => {
  try {
    const result = await getAll();
    /* if (result.length == 0) {
      return res.status(404).json({ message: "Collectors have not yet!" });
    }*/
    res.status(200).json(result);
  } catch (e) {
    res
      .status(500)
      .json({ message: "Error from getAllCollector", error: e.message });
  }
};

const getByIdCollectorCont = async (req, res) => {
  const { id } = req.params;
  if (!id) return res.status(400).json({ message: "please send user's id" });
  try {
    const result = await getByIdCollector(id);

    /* if (result.length == 0)
      return res.status(404).json({ message: "Collector has not" });*/
    const { id: collector_id, login, createdat } = result[0];
    res.status(200).json({
      collector_id,
      login,
      createdat,
    });
  } catch (e) {
    res
      .status(500)
      .json({ message: "Error from getByIdCollectorCont", error: e.message });
  }
};

const getCollectorMoney = async (req, res) => {
  try {
    const result = await collectByCollector();
    return res.status(200).json({ result });
  } catch (e) {
    res
      .status(500)
      .json({ message: "Error from getCollectorMoney", error: e.message });
  }
};
module.exports = {
  getAllCollector,
  getByIdCollectorCont,
  getCollectorMoney,
};
