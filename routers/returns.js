const express = require("express");
const {
  getAllReturns,
  getCountReturns,
  addReturn,
} = require("../controllers/returns/return");

const router = express.Router();
/**
 * @swagger
 * /returns/users:
 *   get:
 *     summary: Retrieve all returns with pagination
 *     tags:
 *       - Returns
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         required: true
 *         description: Page number
 *     responses:
 *       200:
 *         description: List of returns retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *       400:
 *         description: Page number not provided
 *       404:
 *         description: No returns found
 */

/**
 * @swagger
 * /returns/count:
 *   get:
 *     summary: Retrieve the total count of returns
 *     tags:
 *       - Returns
 *     responses:
 *       200:
 *         description: Count of returns retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 count:
 *                   type: integer
 *       400:
 *         description: Error retrieving the count
 */

/**
 * @swagger
 * /returns/add/{id}:
 *   post:
 *     summary: Add a new return for a user
 *     tags:
 *       - Returns
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               product_name:
 *                 type: string
 *               reason:
 *                 type: string
 *     responses:
 *       201:
 *         description: Return added successfully
 *       400:
 *         description: Missing required fields
 *       404:
 *         description: User ID or product name is incorrect
 */

router.get("/users", getAllReturns);
router.get("/count", getCountReturns);
router.post("/add/:id", addReturn);

module.exports = router;
