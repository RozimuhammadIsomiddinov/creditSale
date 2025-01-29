require("dotenv").config();
const pool = require("../../config/dbconfig");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const selectById = `
        SELECT *FROM admin WHERE name = $1;
`;
const createadminQuery = `
        INSERT INTO admin (
        name ,
        password
        )
        VALUES($1,$2)
        RETURNING *;
`;

const selectByName = async (name) => {
  try {
    const res = await pool.query(selectById, [name]);
    return res.rows;
  } catch (e) {
    console.log("error from selectByName" + e.message);
  }
};
const createAdmin = async () => {
  const { NAME, PASSWORD } = process.env;

  try {
    // Admin bor-yo'qligini tekshirish
    const checkAdmin = await pool.query(selectById, [NAME]);

    if (checkAdmin.rows.length > 0) {
      console.log("Admin allaqachon mavjud.");
      return;
    }

    // Agar admin mavjud bo'lmasa
    const hashedPassword = await bcrypt.hash(PASSWORD, 10);
    await pool.query(createadminQuery, [NAME, hashedPassword]);
  } catch (e) {
    console.log("Xatolik createAdmin: " + e.message);
  }
};

const generateJWT = (user) => {
  return jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
    expiresIn: "10h",
  });
};
createAdmin();

module.exports = { selectByName, generateJWT };
