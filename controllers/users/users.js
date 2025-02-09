const { logger } = require("../../logs/log");
const { getByNameCollector } = require("../collector/model");
const { getByName } = require("../zone/model");
const {
  getAll,
  getById,
  createUser,
  updateModel,
  deleteUser,
} = require("./model");

const getAllUsers = async (req, res) => {
  const { page } = req.query;
  if (!page)
    return res.status(400).json({ message: "please send page number" });
  try {
    const result = await getAll(page);
    if (result.length == 0) {
      return res.status(404).json({ message: "users have not yet!" });
    }
    res.status(200).json(result);
  } catch (e) {
    res
      .status(400)
      .json({ message: "Error from getAllUsers", error: e.message });
  }
};

const getByIdUser = async (req, res) => {
  const { id } = req.params;
  if (!id) return res.status(400).json({ message: "please send user's id" });
  try {
    const result = await getById(id);
    if (result.length == 0)
      return res.status(404).json({ message: "user has not" });
    res.status(200).json(result[0]);
  } catch (e) {
    res
      .status(400)
      .json({ message: "Error from getByIdUser", error: e.message });
  }
};

const addUser = async (req, res) => {
  const {
    name,
    product_name,
    cost,
    phone_number,
    phone_number2,
    workplace,
    time,
    zone,
    seller,
    collector,
    passport_series,
    description,
    given_day,
  } = req.body;

  if (
    !name ||
    !product_name ||
    !cost ||
    !phone_number ||
    !zone ||
    !seller ||
    !workplace ||
    !time ||
    !collector ||
    !passport_series
  ) {
    return res
      .status(400)
      .json({ message: "Please provide all required fields." });
  }

  const res1 = await getByName(zone);
  const res2 = await getByNameCollector(collector);

  if (res1.length == 0 || res2.length == 0)
    return res.status(404).json({
      message:
        "Zone or collector name has not\n please enter true zone or collector name",
    });
  try {
    const newUser = await createUser({
      name,
      product_name,
      cost,
      phone_number,
      phone_number2,
      workplace,
      time,
      zone,
      seller,
      collector,
      passport_series,
      description,
      given_day: given_day || new Date(),
    });

    if (!newUser) {
      return res.status(400).json({ message: "User was not created." });
    }
    logger.info(newUser);

    return res.status(201).json({
      message: "User added successfully!",
      user: newUser ? newUser : "user doesn't saved",
    });
  } catch (e) {
    res.status(400).json({ message: "Error from addUser", error: e.message });
  }
};

const updateUser = async (req, res) => {
  const { id } = req.params;
  const {
    name,
    product_name,
    cost,
    phone_number,
    phone_number2,
    workplace,
    time,
    zone,
    seller,
    collector,
    passport_series,
    description,
    given_day,
  } = req.body;

  if (
    !name ||
    !product_name ||
    !cost ||
    !phone_number ||
    !seller ||
    !zone ||
    !workplace ||
    !time ||
    !collector ||
    !passport_series
  ) {
    return res
      .status(400)
      .json({ message: "Please provide all required fields." });
  }
  const res1 = await getByName(zone);
  const res2 = await getByNameCollector(collector);

  if (res1.length == 0 || res2.length == 0)
    return res.status(404).json({
      message:
        "Zone or collector name has not\n please enter true zone or collector name",
    });
  try {
    const result = await updateModel(id, {
      name,
      product_name,
      cost,
      phone_number,
      phone_number2,
      workplace,
      time,
      zone,
      seller,
      collector,
      passport_series,
      description,
      given_day: given_day || new Date(),
    });
    logger.info(result);
    return res.status(201).json({
      message: "User updated successfully!",
      result,
    });
  } catch (e) {
    res
      .status(400)
      .json({ message: "Error from updateUser", error: e.message });
  }
};

const deleteUserByID = async (req, res) => {
  const { id } = req.params;
  if (!id) return res.status(400).json({ message: "please send user's id" });
  try {
    const result1 = await getById(id);

    if (result1.length == 0)
      return res.status(404).json({ message: "user has not" });

    const result2 = await deleteUser(id);
    console.log(result2);
    if (result2 != 1)
      return res.status(400).json({ message: "user not found" });

    res.status(200).json({ message: "user has succesfully deleted" });
  } catch (e) {
    res
      .status(400)
      .json({ message: "Error from deleteUserByID", error: e.message });
  }
};
module.exports = {
  getAllUsers,
  getByIdUser,
  addUser,
  updateUser,
  deleteUserByID,
};
