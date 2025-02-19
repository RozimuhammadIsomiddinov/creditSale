const { getByIdWorkplace } = require("../../workplace/model");
const {
  getByZoneBool,
  getByZoneAndWorkplace,
  getByIdZones,
} = require("../../zone/model");

const filterByZoneBoolean = async (req, res) => {
  const { page } = req.query;
  const { zone_id, payment_status } = req.body;
  if (!zone_id) return res.status(400).json({ message: "fill all fields" });
  if (typeof payment_status != "boolean")
    return res.status(400).json({ message: "enter true format" });

  try {
    const result1 = await getByIdZones(zone_id);
    if (!result1) return res.status(404).json({ message: "zone not found" });

    const result = await getByZoneBool(zone_id, payment_status, page);
    return res.status(200).json(result);
  } catch (e) {
    res
      .status(400)
      .json({ message: "Error from filterByZoneBoolean", error: e.message });
  }
};

const filterByZoneAndWorkplace = async (req, res) => {
  const { page } = req.query;
  const { zone_id, workplace_id, payment_status } = req.body;
  if (!zone_id || !workplace_id)
    return res.status(400).json({ message: "fill all fields" });

  if (typeof payment_status != "boolean")
    return res.status(400).json({ message: "enter true format" });
  try {
    const result1 = await getByIdZones(zone_id);
    if (!result1.length)
      return res.status(404).json({ message: "zone not found" });

    const result2 = await getByIdWorkplace(workplace_id);
    if (!result2.length)
      return res.status(404).json({ message: "workplace not found" });

    const result = await getByZoneAndWorkplace(
      zone_id,
      workplace_id,
      payment_status,
      page
    );
    return res.status(200).json(result);
  } catch (e) {
    res.status(400).json({
      message: "Error from filterByZoneAndWorkplace",
      error: e.message,
    });
  }
};
module.exports = { filterByZoneBoolean, filterByZoneAndWorkplace };
