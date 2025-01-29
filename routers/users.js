const express = require("express");
const {
  getAllUsers,
  getByIdUser,
  addUser,
  updateUser,
  deleteUserByID,
} = require("../controllers/users/users");
const router = express.Router();

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users
 *     tags:
 *       - Users
 *     parameters:
 *       - in: query
 *         name: page
 *         required: true
 *         schema:
 *           type: integer
 *           format: int32
 *         description: Page number for pagination
 *     responses:
 *       200:
 *         description: Successfully retrieved users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/definitions/User'
 *       400:
 *         description: Page number not provided
 *       404:
 *         description: No users found
 *
 * /users/{id}:
 *   get:
 *     summary: Get user by ID
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           format: int32
 *         description: User ID to retrieve
 *     responses:
 *       200:
 *         description: Successfully retrieved user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/definitions/User'
 *       400:
 *         description: Invalid user ID
 *       404:
 *         description: User not found
 *
 * /users/add:
 *   post:
 *     summary: Add a new user
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/definitions/User'
 *     responses:
 *       201:
 *         description: User added successfully
 *       400:
 *         description: Invalid input data
 *       404:
 *         description: Zone or collector not found
 *
 * /users/update/{id}:
 *   put:
 *     summary: Update user by ID
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           format: int32
 *         description: User ID to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/definitions/User'
 *     responses:
 *       200:
 *         description: User updated successfully
 *       400:
 *         description: Invalid input data
 *       404:
 *         description: Zone or collector not found
 * /users/delete/{id}:
 *   delete:
 *     summary: Delete user by ID
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           format: int32
 *         description: User ID to delete
 *     responses:
 *       200:
 *         description: User successfully deleted
 *       400:
 *         description: Invalid user ID or user not found
 *       404:
 *         description: User not found
 */

/**
 * @swagger
 * definitions:
 *   User:
 *     type: object
 *     properties:
 *       name:
 *         type: string
 *       product_name:
 *         type: string
 *       cost:
 *         type: number
 *         format: float
 *       phone_number:
 *         type: string
 *       phone_number2:
 *         type: string
 *       workplace:
 *         type: string
 *       time:
 *         type: string
 *         format: date-time
 *       zone:
 *         type: string
 *       seller:
 *         type: string
 *       collector:
 *         type: string
 *       passport_series:
 *         type: string
 *       description:
 *         type: string
 *       given_day:
 *         type: string
 *         format: date-time
 *     required:
 *       - name
 *       - product_name
 *       - cost
 *       - phone_number
 *       - zone
 *       - seller
 *       - workplace
 *       - time
 *       - collector
 *       - passport_series
 */

router
  .get("/", getAllUsers)
  .get("/:id", getByIdUser)
  .post("/add", addUser)
  .put("/update/:id", updateUser)
  .delete("/delete/:id", deleteUserByID);

module.exports = router;
