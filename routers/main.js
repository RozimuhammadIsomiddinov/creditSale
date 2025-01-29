const express = require("express");
const {
  getAllMoney,
  getNotPayedUsers,
  getMonthSum,
  getTodaySum,
} = require("../controllers/main/main");

const router = express.Router();
/**
 * @swagger
 * /main/all:
 *   get:
 *     summary: Get all income data
 *     tags: [Main]
 *     responses:
 *       200:
 *         description: Successfully retrieved all income data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 all_income:
 *                   type: number
 *                   example: 50000
 *                 income_users_count:
 *                   type: integer
 *                   example: 100
 *                 paid_money:
 *                   type: number
 *                   example: 30000
 *                 paid_users_count:
 *                   type: integer
 *                   example: 60
 *
 * /main/notPayed:
 *   get:
 *     summary: Get users who have not paid
 *     tags: [Main]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number for pagination
 *     responses:
 *       200:
 *         description: List of users who have not paid
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 count:
 *                   type: integer
 *                   example: 20
 *                 result:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       user_id:
 *                         type: integer
 *                         example: 5
 *                       username:
 *                         type: string
 *                         example: "John Doe"
 *
 * /main/month:
 *   get:
 *     summary: Get monthly income summary
 *     tags: [Main]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number for pagination
 *     responses:
 *       200:
 *         description: Monthly income data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 sum:
 *                   type: number
 *                   example: 15000
 *                 count:
 *                   type: integer
 *                   example: 30
 *                 result:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       date:
 *                         type: string
 *                         example: "2024-01-15"
 *                       amount:
 *                         type: number
 *                         example: 500
 *
 * /main/today:
 *   get:
 *     summary: Get today's income summary
 *     tags: [Main]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number for pagination
 *     responses:
 *       200:
 *         description: Today's income data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 sum:
 *                   type: number
 *                   example: 5000
 *                 count:
 *                   type: integer
 *                   example: 10
 *                 result:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       date:
 *                         type: string
 *                         example: "2024-01-29"
 *                       amount:
 *                         type: number
 *                         example: 200
 */

router
  .get("/all", getAllMoney)
  .get("/notPayed", getNotPayedUsers)
  .get("/month", getMonthSum)
  .get("/today", getTodaySum);

module.exports = router;
