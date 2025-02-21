const {
  getByZoneBool,
  getByZoneAndWorkplace,
  getByIdZones,
} = require("../../zone/model");
const { getByIdCollector } = require("../model");

const filterByZoneBoolean = async (req, res) => {
  const { id } = req.params;
  if (!id) return res.status(400).json({ message: "send a collector's id" });

  const { page } = req.query;
  if (!page) return res.status(400).json({ message: "send a page number" });

  try {
    const result2 = await getByIdCollector(id);
    if (!result2.length)
      return res.status(404).json({ message: "collector not found" });

    const result = await getByZoneBool(id, page);
    return res.status(200).json(result);
  } catch (e) {
    res
      .status(500)
      .json({ message: "Error from filterByZoneBoolean", error: e.message });
  }
};

const filterByZoneAndWorkplace = async (req, res) => {
  const { collector_id, zone_id } = req.body;
  if (!collector_id || !zone_id)
    return res.status(400).json({ message: "fill all fields" });

  const { page } = req.query;
  if (!page) return res.status(400).json({ message: "send a page number" });

  try {
    const result1 = await getByIdZones(zone_id);
    if (!result1.length)
      return res.status(404).json({ message: "zone not found" });

    const result2 = await getByIdCollector(collector_id);
    if (!result2.length)
      return res.status(404).json({ message: "collector not found" });

    const result = await getByZoneAndWorkplace(collector_id, zone_id, page);

    return res.status(200).json(result);
  } catch (e) {
    res.status(500).json({
      message: "Error from filterByZoneAndWorkplace",
      error: e.message,
    });
  }
};
module.exports = { filterByZoneBoolean, filterByZoneAndWorkplace };
