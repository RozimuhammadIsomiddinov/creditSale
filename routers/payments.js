const express = require("express");
const {
  getPaymentHistory,
  addPaymentAmount,
} = require("../controllers/payments/payment");

const router = express.Router();
/**
 * @swagger
 * /payment/history/{id}:
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
 *
 * /payment/add/{id}:
 *   post:
 *     summary: Add a payment for a user
 *     tags:
 *       - Payments
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID to add payment
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               amount:
 *                 type: number
 *                 example: 100
 *               collector:
 *                 type: string
 *                 example: "John Collector"
 *               payment_month:
 *                 type: string
 *                 example: "January"
 *               description:
 *                 type: string
 *                 example: "Monthly payment"
 *     responses:
 *       201:
 *         description: Payment added successfully
 *       400:
 *         description: Invalid input data
 *       404:
 *         description: User or collector not found
 */

router.get("/history/:id", getPaymentHistory);
router.post("/add/:id", addPaymentAmount);

module.exports = router;
