const { sign, verify } = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;

class JWT {
  constructor(data) {
    this.data = data;
  }

  sign() {
    return sign(this.data, JWT_SECRET, { expiresIn: "15h" });
  }

  static verify(token) {
    try {
      return verify(token, JWT_SECRET);
    } catch (error) {
      return null;
    }
  }
}

module.exports = JWT;
