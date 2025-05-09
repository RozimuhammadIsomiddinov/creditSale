const JWT = require("../lib/jwt");
const { getById } = require("../controllers/users/model");
const { getByIdCollector } = require("../controllers/collector/model");

const auth = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; // Bearer token
  if (!token) {
    return res.status(401).json({ error: "Please send a token" });
  }

  try {
    const decoded = JWT.verify(token);
    if (!decoded || !decoded.id) {
      return res.status(401).json({ error: "Invalid token" });
    }

    let admin = await getById(decoded.id);

    if (!admin) {
      admin = await getByIdCollector(decoded.id);
    }

    if (!admin) {
      return res.status(401).json({ error: "User not found" });
    }

    next();
  } catch (e) {
    res.status(401).json({ error: "Invalid token" });
  }
};

module.exports = { auth };
