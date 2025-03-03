const express = require("express");
const {
  addUser,
  countUsers,
  updateUser,
  getAllUsers,
  getByIdUser,
  deleteUserByID,
  getAllUsersZoneAndWorkplace,
  searchPhoneNameID,
  getAllUsersZoneAndWorkplaceBoolean,
} = require("../controllers/users/users");

const router = express.Router();

/**
 * @swagger
 * /users/filter/{id}:
 *   get:
 *     summary: Get all users By Zone
 *     tags:
 *       - Users-Filter
 *     parameters:
 *       - in: query
 *         name: page
 *         required: true
 *         schema:
 *           type: integer
 *           format: int32
 *         description: Page number for pagination
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           format: int32
 *         description: Enter a zone_id
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
 * /users/search/{q}:
 *   get:
 *     summary: User search by phone,name and id
 *     tags:
 *       - Search
 *     parameters:
 *       - in: path
 *         name: q
 *         required: true
 *         schema:
 *          type: string
 *         description: User search by phone,name and id
 *     responses:
 *       200:
 *         description: Successfully search
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
 *       phone_number:
 *         type: string
 *       phone_number2:
 *         type: string
 *       workplace_id:
 *         type: number
 *       time:
 *         type: number
 *       zone_id:
 *         type: number
 *       seller:
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
 *       - zone_id
 *       - seller
 *       - workplace_id
 *       - time
 *       - passport_series
 */

/**
 * @swagger
 * /users/filter-workplace:
 *   post:
 *     summary: Get all users By Zone and Workplace
 *     tags:
 *       - Users-Filter
 *     parameters:
 *       - in: query
 *         name: page
 *         required: true
 *         schema:
 *           type: integer
 *           format: int32
 *         description: Page number for pagination
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               zone_id:
 *                 type: number
 *                 example: 1
 *               workplace_id:
 *                 type: number
 *                 example: 1
 *     responses:
 *       200:
 *         description: List of users matching the given filters
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   zone_id:
 *                     type: number
 *                     example: 1
 *                   workplace_id:
 *                     type: number
 *                     example: 1
 *       400:
 *         description: Bad request, missing or incorrect parameters
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /users/filter:
 *   post:
 *     summary: Get all  users by zone, workplace, and payment status
 *     tags:
 *       - Users-Filter
 *     parameters:
 *       - in: query
 *         name: page
 *         required: true
 *         schema:
 *           type: integer
 *           format: int32
 *         description: Page number for pagination
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               zone_id:
 *                 type: integer
 *                 example: 1
 *               workplace_id:
 *                 type: integer
 *                 example: 1
 *               payment_status:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: Successfully filtered users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/definitions/User'
 *       400:
 *         description: Missing fields or invalid format
 *       404:
 *         description: Zone or workplace not found
 */

router.get("/count", countUsers);
router.get("/search/:q", searchPhoneNameID);
router.get("/filter/:id", getAllUsers);
router.post("/filter-workplace", getAllUsersZoneAndWorkplace);
router.post("/filter", getAllUsersZoneAndWorkplaceBoolean);

router.get("/:id", getByIdUser);
router.post("/add", addUser);

router.put("/update/:id", updateUser);
router.delete("/delete/:id", deleteUserByID);
module.exports = router;
