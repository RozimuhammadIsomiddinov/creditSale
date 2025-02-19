const {
  getAll,
  getByIdZones,
  createZone,
  updatedZone,
  getZoneStatistics,
} = require("./model");

const findZoneById = async (id, res) => {
  if (!id) {
    res.status(400).json({ message: "send an id" });
    return null;
  }
  const result = await getByIdZones(id);
  if (result.length === 0) {
    res.status(404).json({ message: "zone has not" });
    return null;
  }
  return result[0];
};

const getAllZone = async (req, res) => {
  try {
    const result = await getAll();
    if (result.length === 0) {
      return res.status(404).json({ message: "zones have not yet" });
    }
    res.status(200).json(result);
  } catch (e) {
    res
      .status(500)
      .json({ message: "Server xatosi: getAllZone", error: e.message });
  }
};

const getByIdZone = async (req, res) => {
  try {
    const zone = await findZoneById(req.params.id, res);
    if (zone) res.status(200).json(zone);
  } catch (e) {
    res
      .status(500)
      .json({ message: "Server xatosi: getByIdZone", error: e.message });
  }
};

const addZone = async (req, res) => {
  const { zone_name, description } = req.body;
  if (!zone_name) {
    return res.status(400).json({ message: "send a zone_name" });
  }
  try {
    const result = await createZone(zone_name, description);
    if (!result) return res.status(400).json({ message: "unsuccesfully." });

    return res.status(201).json({
      message: "succesfully",
      zone: result,
    });
  } catch (e) {
    res
      .status(500)
      .json({ message: "Server xatosi: addZone", error: e.message });
  }
};

const updateZone = async (req, res) => {
  try {
    const zone = await findZoneById(req.params.id, res);
    if (!zone) return;

    const { zone_name, description } = req.body;
    if (!zone_name) {
      return res.status(400).json({ message: "send a zone_name" });
    }

    const result = await updatedZone(req.params.id, zone_name, description);
    res.status(200).json({ message: "succesfully", result });
  } catch (e) {
    res
      .status(500)
      .json({ message: "Server xatosi: updateZone", error: e.message });
  }
};
const selectByZone = async (req, res) => {
  try {
    const statistics = await getZoneStatistics();

    res.status(200).json(statistics);
  } catch (e) {
    res
      .status(500)
      .json({ message: "Server xatosi: selectByZone", error: e.message });
  }
};

module.exports = {
  getAllZone,
  getByIdZone,
  addZone,
  updateZone,
  selectByZone,
};
