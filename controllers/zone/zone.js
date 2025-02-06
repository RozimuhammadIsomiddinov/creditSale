const {
  getAll,
  getById,
  createZone,
  updatedZone,
  filterZone,
} = require("./model");

const getAllZone = async (req, res) => {
  try {
    const result = await getAll();
    if (result.length == 0) {
      return res.status(404).json({ message: "Zones have not yet!" });
    }
    res.status(200).json(result);
  } catch (e) {
    res
      .status(400)
      .json({ message: "Error from getAllZone", error: e.message });
  }
};

const getByIdZone = async (req, res) => {
  const { id } = req.params;
  if (!id) return res.status(400).json({ message: "please send user's id" });
  try {
    const result = await getById(id);
    if (result.length == 0)
      return res.status(404).json({ message: "Zone has not" });
    res.status(200).json(result[0]);
  } catch (e) {
    res
      .status(400)
      .json({ message: "Error from getByIdZone", error: e.message });
  }
};

const addZone = async (req, res) => {
  const { zone_name, description } = req.body;

  if (!zone_name)
    return res
      .status(400)
      .json({ message: "Please provide  required zone_name." });
  try {
    const result = await createZone(req.body);
    return res.status(201).json({
      message: "Zone added successfully!",
      zone: result ? result : "zone doesn't saved",
    });
  } catch (e) {
    res.status(400).json({ message: "Error from addZone", error: e.message });
  }
};

const updateZone = async (req, res) => {
  const { id } = req.params;
  if (!id) return res.status(400).json({ message: "please send user's id" });
  const { zone_name, description } = req.body;
  if (!zone_name)
    return res
      .status(400)
      .json({ message: "Please provide  required zone_name." });

  try {
    const result1 = await getById(id);
    if (result1.length == 0)
      return res.status(404).json({ message: "Zone has not" });

    const result = await updatedZone({ id, zone_name, description });
    return res.status(201).json({
      message: "zone updated successfully!",
      result,
    });
  } catch (e) {
    res
      .status(400)
      .json({ message: "Error from updateZone", error: e.message });
  }
};

const filterZoneUsers = async (req, res) => {
  const { zone } = req.body;
  if (!zone)
    return res.status(400).json({ message: "please send a zone name" });
  const { page } = req.query;
  if (!page)
    return res.status(400).json({ message: "please send page number" });
  try {
    const result = await filterZone(zone, page);
    if (result.length == 0) {
      return res.status(404).json({ message: "users have not yet!" });
    }
    res.status(200).json(result);
  } catch (e) {
    res
      .status(400)
      .json({ message: "Error from filterZoneUsers", error: e.message });
  }
};

module.exports = {
  getAllZone,
  getByIdZone,
  addZone,
  updateZone,
  filterZoneUsers,
};
