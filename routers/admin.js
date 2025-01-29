const express = require("express");
const { loginMid } = require("../controllers/admin/login");

const router = express.Router();
/**
 * @swagger
 * /admin/login:
 *   post:
 *     summary: Admin login
 *     tags: [Admin]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "admin123"
 *               password:
 *                 type: string
 *                 example: "securepassword"
 *     responses:
 *       200:
 *         description: Muvaffaqiyatli login
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   example: "JWT_TOKEN"
 *       401:
 *         description: Noto'g'ri parol
 *       404:
 *         description: Admin topilmadi
 *       500:
 *         description: Server xatosi
 */

router.post("/login", loginMid);

module.exports = router;
