const { logger } = require("../../logs/log");
const { getByIdWorkplace } = require("../workplace/model");
const { getByIdZones } = require("../zone/model");
const {
  getAll,
  getById,
  createUser,
  updateModel,
  deleteUser,
  countAllUsers,
  getByZoneWorkplace,
  search,
  getByZoneWorkplaceBoolean,
} = require("./model");

const countUsers = async (req, res) => {
  try {
    const result = await countAllUsers();
    res.status(200).json(result);
  } catch (e) {
    res
      .status(500)
      .json({ message: "Error from countUsers", error: e.message });
  }
};

const getAllUsers = async (req, res) => {
  const { id } = req.params;
  if (!id) return res.status(400).json({ message: "send a zone id" });

  const { page } = req.query;
  if (!page) {
    return res.status(400).json({ message: "Please send a page number" });
  }
  try {
    /* const result1 = await getByIdZones(id);
    if (!result1) return res.status(400).json({ message: "zone has not" });
*/
    const result = await getAll(id, page);
    /*  if (result.length === 0) {
      return res.status(404).json({ message: "No users found!" });
    }*/
    res.status(200).json(result);
  } catch (e) {
    res
      .status(500)
      .json({ message: "Error from getAllUsers", error: e.message });
  }
};

const getAllUsersZoneAndWorkplace = async (req, res) => {
  const { zone_id, workplace_id } = req.body;
  if (!zone_id || !workplace_id)
    return res.status(400).json({ message: "send zone and workplace id" });

  const { page } = req.query;
  if (!page) {
    return res.status(400).json({ message: "Please send a page number" });
  }
  try {
    /*const result1 = await getByIdZones(zone_id);
    if (!result1.length)
      return res.status(404).json({ message: "zone not found" });

    const result2 = await getByIdWorkplace(workplace_id);
    if (!result2.length)
      return res.status(404).json({ message: "workplace not found" });
*/
    const result = await getByZoneWorkplace(zone_id, workplace_id);
    return res.status(200).json(result);
  } catch (e) {
    res.status(500).json({
      message: "Error from getAllUsersZoneAndWorkplace",
      error: e.message,
    });
  }
};

const getAllUsersZoneAndWorkplaceBoolean = async (req, res) => {
  const { page } = req.query;
  if (!page) return res.status(400).json({ message: "send a page number" });

  const { zone_id, workplace_id, payment_status } = req.body;
  /*if (!zone_id || !workplace_id)
    return res.status(400).json({ message: "send zone_id and workplace_id" });*/
  try {
    /*const result1 = await getByIdZones(zone_id);
    if (!result1.length)
      return res.status(404).json({ message: "zone not found" });

    const result2 = await getByIdWorkplace(workplace_id);
    if (!result2.length)
      return res.status(404).json({ message: "workplace not found" });
*/
    const result = await getByZoneWorkplaceBoolean(
      zone_id,
      workplace_id,
      payment_status,
      page
    );
    return res.status(200).json(result);
  } catch (e) {
    res.status(500).json({
      message: "Error from getAllUsersZoneAndWorkplaceBoolean",
      error: e.message,
    });
  }
};

const getByIdUser = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ message: "Please provide a user ID" });
  }
  try {
    const result = await getById(id);
    /*  if (!result) {
      return res.status(404).json({ message: "User not found" });
    }*/
    res.status(200).json(result);
  } catch (e) {
    res
      .status(500)
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
    workplace_id,
    time,
    zone_id,
    seller,
    passport_series,
    description,
    given_day,
  } = req.body;

  if (
    !name ||
    !product_name ||
    !cost ||
    !phone_number ||
    !zone_id ||
    !seller ||
    !workplace_id ||
    !time
  ) {
    return res
      .status(400)
      .json({ message: "Please provide all required fields." });
  }

  try {
    const zoneData = await getByIdZones(zone_id);
    const workplaceData = await getByIdWorkplace(workplace_id);
    if (!zoneData.length || !workplaceData) {
      return res
        .status(404)
        .json({ message: "Invalid zone  or workplace name" });
    }

    const newUser = await createUser({
      name,
      product_name,
      cost,
      phone_number,
      phone_number2,
      workplace_id,
      time,
      zone_id,
      seller,
      passport_series,
      description,
      given_day: given_day || new Date(),
    });

    if (!newUser) {
      return res.status(500).json({ message: "User creation failed", newUser });
    }

    logger.info("New user added:", newUser);
    res
      .status(201)
      .json({ message: "User added successfully!", user: newUser });
  } catch (e) {
    res.status(500).json({ message: "Error from addUser", error: e.message });
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
    workplace_id,
    time,
    zone_id,
    seller,
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
    !zone_id ||
    !workplace_id ||
    !time
  ) {
    return res
      .status(400)
      .json({ message: "Please provide all required fields." });
  }

  try {
    /* const zoneData = await getByIdZones(zone_id);
    const workplaceData = await getByIdWorkplace(workplace_id);
    if (!zoneData || !workplaceData) {
      return res
        .status(404)
        .json({ message: "Invalid zone or workplace name" });
    }
*/
    const updatedUser = await updateModel(id, {
      name,
      product_name,
      cost,
      phone_number,
      phone_number2,
      workplace_id,
      time,
      zone_id,
      seller,
      passport_series,
      description,
      given_day: given_day || new Date(),
    });

    if (!updatedUser) {
      return res.status(500).json({ message: "User update failed" });
    }

    logger.info("User updated:", updatedUser);
    res
      .status(200)
      .json({ message: "User updated successfully!", user: updatedUser });
  } catch (e) {
    res
      .status(500)
      .json({ message: "Error from updateUser", error: e.message });
  }
};

const deleteUserByID = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ message: "Please provide a user ID" });
  }
  try {
    /* const userExists = await getById(id);

    if (!userExists) {
      return res.status(404).json({ message: "User not found" });
    }
*/
    const deleteResult = await deleteUser(id);
    if (deleteResult !== 1) {
      return res.status(500).json({ message: "User deletion failed" });
    }

    res.status(200).json({ message: "User deleted successfully" });
  } catch (e) {
    res
      .status(500)
      .json({ message: "Error from deleteUserByID", error: e.message });
  }
};

const searchPhoneNameID = async (req, res) => {
  const { q } = req.params;
  if (!q) {
    return res.status(400).json({ error: "Query parameter is required" });
  }

  try {
    const result = await search(q);
    /* if (!result.length) return res.status(404).json({ message: "not found" });*/

    return res.status(200).json(result);
  } catch (e) {
    res
      .status(500)
      .json({ message: "Error from searchPhoneNameID", error: e.message });
  }
};

module.exports = {
  addUser,
  updateUser,
  countUsers,
  getAllUsers,
  getByIdUser,
  deleteUserByID,
  searchPhoneNameID,
  getAllUsersZoneAndWorkplace,
  getAllUsersZoneAndWorkplaceBoolean,
};
