const {
  getAllWorkplace,
  getByIdWorkplace,
  createWorkplace,
  updatedWorkplace,
} = require("./model");

const selectAllWorkplace = async (req, res) => {
  try {
    const result = await getAllWorkplace();
    if (result.length == 0) {
      return res.status(404).json({ message: "Workplaces have not yet!" });
    }
    res.status(200).json(result);
  } catch (e) {
    res
      .status(500)
      .json({ message: "Error from getAllWorkplace", error: e.message });
  }
};

const selectByIDWorkplace = async (req, res) => {
  const { id } = req.params;
  if (!id) return res.status(400).json({ message: "please send user's id" });

  try {
    const result = await getByIdWorkplace(id);
    if (result.length == 0)
      return res.status(404).json({ message: "Workplace has not" });
    res.status(200).json(result[0]);
  } catch (e) {
    res
      .status(500)
      .json({ message: "Error from getAllWorkplace", error: e.message });
  }
};

const addWorkplace = async (req, res) => {
  const { workplace_name, description } = req.body;
  if (!workplace_name)
    return res
      .status(400)
      .json({ message: "Please provide  required Workplace_name." });

  try {
    const result = await createWorkplace(workplace_name, description);
    if (!result) return res.status(400).json({ message: "unsuccesfully" });
    return res.status(201).json({
      message: "Workplace added successfully!",
      workplace: result,
    });
  } catch (e) {
    res
      .status(500)
      .json({ message: "Error from addWorkplace", error: e.message });
  }
};

const updateWorkplace = async (req, res) => {
  const { id } = req.params;
  if (!id)
    return res.status(400).json({ message: "please send workplace's id" });
  const { workplace_name, description } = req.body;
  if (!workplace_name)
    return res
      .status(400)
      .json({ message: "Please provide required Workplace_name." });
  try {
    const result1 = await getByIdWorkplace(id);
    if (result1.length == 0)
      return res.status(404).json({ message: "Workplace has not" });

    const result = await updatedWorkplace(id, workplace_name, description);
    if (!result) return res.status(400).json({ message: "unsuccesfully" });

    return res.status(201).json({
      message: "successfully!",
      result,
    });
  } catch (e) {
    res
      .status(500)
      .json({ message: "Error from updateWorkplace", error: e.message });
  }
};

module.exports = {
  selectAllWorkplace,
  selectByIDWorkplace,
  addWorkplace,
  updateWorkplace,
};
