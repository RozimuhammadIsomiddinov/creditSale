const { compare } = require("bcryptjs");
const { selectByName, generateJWT } = require("./model");

const loginMid = async (req, res) => {
  const { name, password } = req.body;
  try {
    const result1 = await selectByName(name);
    if (result1.length == 0)
      return res.status(404).json({ message: "admin not found" });

    const isMatch = await compare(password, result1[0].password);
    if (!isMatch) {
      return res.status(401).json({ message: "parol is incorrect" });
    }

    const token = generateJWT(result1);
    res.status(200).json({
      token,
      admin_name: result1[0].name,
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

module.exports = { loginMid };
