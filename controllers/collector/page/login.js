const { compare } = require("bcryptjs");

const JWT = require("../../../lib/jwt");
const { getByNameCollector } = require("../model");

const loginCollector = async (req, res) => {
  const { login, password } = req.body;
  try {
    const result1 = await getByNameCollector(login);
    if (result1.length == 0)
      return res.status(404).json({ message: "collector not found" });

    const isMatch = await compare(password, result1[0].password);
    if (!isMatch) {
      return res.status(401).json({ message: "parol is incorrect" });
    }
    const jwtInstance = new JWT({ id: result1[0].id, login: result1[0].login });
    const token = jwtInstance.sign();
    res.status(200).json({
      token,
      collector_name: result1[0].login,
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

module.exports = { loginCollector };
