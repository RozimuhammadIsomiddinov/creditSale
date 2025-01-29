const jwt = require("jsonwebtoken");
const { getById } = require("../controllers/users/model");

const auth = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; // bearer token
  if (!token) {
    return res.status(401).json({ error: "please send a token" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const admin = await getById(decoded.id);
    if (!admin) {
      return res.status(401).json({ error: "admin not found" });
    }

    next();
  } catch (e) {
    res.status(401).json({ error: "Invalid token" });
  }
};

module.exports = { auth };
