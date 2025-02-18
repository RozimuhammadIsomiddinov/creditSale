const JWT = require("../lib/jwt");
const { getById } = require("../controllers/collector/model");

const auth_collector = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; // Bearer token
  if (!token) {
    return res.status(401).json({ error: "Please send a token" });
  }

  try {
    const decoded = JWT.verify(token);
    if (!decoded || !decoded.id) {
      return res.status(401).json({ error: "Invalid token" });
    }

    const admin = await getById(decoded.id);
    if (!admin) {
      return res.status(401).json({ error: "Admin not found" });
    }

    next();
  } catch (e) {
    res.status(401).json({ error: "Invalid token" });
  }
};

module.exports = { auth_collector };
