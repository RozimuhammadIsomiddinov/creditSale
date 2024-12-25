const express = require("express");
const {
  getAllUsers,
  getByIdUser,
  addUser,
  updateUser,
} = require("../controllers/users/users");
const router = express.Router();

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Retrieve all users with pagination
 *     tags:
 *       - Users
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         required: true
 *         description: Page number
 *     responses:
 *       200:
 *         description: List of users retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *       400:
 *         description: Page number not provided
 *       404:
 *         description: No users found
 */

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Retrieve a user by ID
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: User ID
 *     responses:
 *       200:
 *         description: User retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       400:
 *         description: User ID not provided
 *       404:
 *         description: User not found
 */

/**
 * @swagger
 * /users/add-user:
 *   post:
 *     summary: Add a new user
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               product_name:
 *                 type: string
 *               cost:
 *                 type: number
 *               phone_number:
 *                 type: string
 *               phone_number2:
 *                 type: string
 *               address:
 *                 type: string
 *               workplace:
 *                 type: string
 *               time:
 *                 type: integer
 *               primary_payment:
 *                 type: number
 *               passport_series:
 *                 type: string
 *               description:
 *                 type: string
 *               given_day:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       201:
 *         description: User added successfully
 *       400:
 *         description: Missing required fields
 */

/**
 * @swagger
 * /users/update/{id}:
 *   put:
 *     summary: Update an existing user
 *     tags:
 *       - Users
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
 *               name:
 *                 type: string
 *               product_name:
 *                 type: string
 *               cost:
 *                 type: number
 *               phone_number:
 *                 type: string
 *               phone_number2:
 *                 type: string
 *               address:
 *                 type: string
 *               workplace:
 *                 type: string
 *               time:
 *                 type: integer
 *               primary_payment:
 *                 type: number
 *               passport_series:
 *                 type: string
 *               description:
 *                 type: string
 *               given_day:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       201:
 *         description: User updated successfully
 *       400:
 *         description: Missing required fields
 */

router.get("/", getAllUsers);
router.get("/:id", getByIdUser);
router.post("/add-user", addUser);
router.put("/update/:id", updateUser);
module.exports = router;
