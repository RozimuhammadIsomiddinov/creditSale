const express = require("express");
const {
  getPrimaryPayment,
  getPrimaryPaymentUsers,
  getAllMoney,
  getThisMonthMoney,
  getMonthUsers,
} = require("../controllers/main/main");
const {
  getPaymentHistory,
  addPaymentAmount,
} = require("../controllers/payments/payment");

const router = express.Router();

/**
 * @swagger
 * /payment/money:
 *   get:
 *     summary: Retrieve all income data
 *     tags:
 *       - Money
 *     responses:
 *       200:
 *         description: Successfully retrieved income data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 result:
 *                   type: array
 *                   items:
 *                     type: object
 *       400:
 *         description: Error retrieving income data
 */

/**
 * @swagger
 * /payment/primary:
 *   get:
 *     summary: Retrieve all primary payment data
 *     tags:
 *       - Money
 *     responses:
 *       200:
 *         description: Successfully retrieved primary payment data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       400:
 *         description: Error retrieving primary payment data
 */

/**
 * @swagger
 * /payment/primary-users:
 *   get:
 *     summary: Retrieve users with primary payments
 *     tags:
 *       - Money
 *     parameters:
 *       - in: query
 *         name: page
 *         required: true
 *         schema:
 *           type: integer
 *         description: Page number for pagination
 *     responses:
 *       200:
 *         description: Successfully retrieved users with primary payments
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 result:
 *                   type: array
 *                   items:
 *                     type: object
 *       400:
 *         description: Page number not provided
 *       404:
 *         description: No users found
 */

/**
 * @swagger
 * /payment/this-month-money:
 *   get:
 *     summary: Retrieve money data for the current month
 *     tags:
 *       - Money
 *     responses:
 *       200:
 *         description: Successfully retrieved this month's money data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       400:
 *         description: Error retrieving this month's money data
 */

/**
 * @swagger
 * /payment/month-paid-users:
 *   get:
 *     summary: Retrieve users who have paid this month
 *     tags:
 *       - Money
 *     parameters:
 *       - in: query
 *         name: page
 *         required: true
 *         schema:
 *           type: integer
 *         description: Page number for pagination
 *     responses:
 *       200:
 *         description: Successfully retrieved users who paid this month
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 rows:
 *                   type: array
 *                   items:
 *                     type: object
 *                 count:
 *                   type: integer
 *       400:
 *         description: Page number not provided
 *       404:
 *         description: No users found
 */
/**
 * @swagger
 * /payment/add/{id}:
 *   post:
 *     summary: Add payment for a user
 *     tags:
 *       - Payments
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID for adding payment
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               amount:
 *                 type: number
 *                 format: float
 *                 description: The amount to be added to the user's payment
 *     responses:
 *       201:
 *         description: Payment added successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 payment:
 *                   type: object
 *                   description: Payment details
 *                 user:
 *                   type: object
 *                   description: Updated user information
 *       400:
 *         description: Invalid or missing amount or user ID
 *       404:
 *         description: User not found or update failed
 */

/**
 * @swagger
 * /payment/user-history/{id}:
 *   get:
 *     summary: Retrieve payment history of a user
 *     tags:
 *       - Payments
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID for retrieving payment history
 *     responses:
 *       200:
 *         description: Successfully retrieved payment history
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 result:
 *                   type: array
 *                   items:
 *                     type: object
 *       400:
 *         description: User ID not provided
 *       404:
 *         description: User's payment history not found
 */

router.get("/money", getAllMoney);
router.get("/primary", getPrimaryPayment);
router.get("/primary-users", getPrimaryPaymentUsers);
router.get("/user-history/:id", getPaymentHistory);

router.get("/this-month-money", getThisMonthMoney);
router.get("/month-paid-users", getMonthUsers);

router.post("/add/:id", addPaymentAmount);
module.exports = router;
