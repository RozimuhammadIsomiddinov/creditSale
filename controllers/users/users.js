const { getAll, getById, createUser, updateModel } = require("./model");

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
    address,
    workplace,
    time,
    primary_payment,
    passport_series,
    description,
    given_day,
  } = req.body;
  if (
    !name ||
    !product_name ||
    !cost ||
    !phone_number ||
    !address ||
    !workplace ||
    !time ||
    primary_payment === undefined ||
    !passport_series
  ) {
    return res
      .status(400)
      .json({ message: "Please provide all required fields." });
  }
  try {
    const newUser = await createUser({
      name,
      product_name,
      cost,
      phone_number,
      phone_number2,
      address,
      workplace,
      time,
      primary_payment,
      passport_series,
      description,
      given_day: given_day || new Date(),
    });
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
    address,
    workplace,
    time,
    primary_payment,
    passport_series,
    description,
    given_day,
  } = req.body;

  if (
    !name ||
    !product_name ||
    !cost ||
    !phone_number ||
    !address ||
    !workplace ||
    !time ||
    primary_payment === undefined ||
    !passport_series
  ) {
    return res
      .status(400)
      .json({ message: "Please provide all required fields." });
  }
  const monthly_income = (cost - primary_payment) / time;

  try {
    const result = await updateModel(id, {
      name,
      product_name,
      cost,
      phone_number,
      phone_number2,
      address,
      workplace,
      time,
      primary_payment,
      passport_series,
      description,
      given_day,
      monthly_income,
    });
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
module.exports = { getAllUsers, getByIdUser, addUser, updateUser };
