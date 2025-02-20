const express = require("express");
const {
  getAllZone,
  getByIdZone,
  addZone,
  updateZone,
  selectByZone,
} = require("../controllers/zone/zone");

const router = express.Router();

/**
 * @swagger
 * /zone/about:
 *   get:
 *     summary: Get zone statistics (payments and users)
 *     tags:
 *       - Zones
 *     responses:
 *       200:
 *         description: Successfully retrieved zone statistics
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 zonedagi_tolaganlar:
 *                   type: integer
 *                   description: The total amount of payments in the zone
 *                 bu_oy_tolagan:
 *                   type: integer
 *                   description: The total amount paid this month in the zone
 *                 hamma_users:
 *                   type: integer
 *                   description: The total number of users in the zone
 *                 tolamagan_users:
 *                   type: integer
 *                   description: The total number of users who haven't paid in the zone
 *       400:
 *         description: Error retrieving zone statistics
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /zone:
 *   get:
 *     summary: Get all zones
 *     tags:
 *       - Zones
 *     responses:
 *       200:
 *         description: Successfully retrieved zones
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   zone_name:
 *                     type: string
 *                   description:
 *                     type: string
 *       404:
 *         description: No zones found
 *       400:
 *         description: Error retrieving zones
 *
 * /zone/{id}:
 *   get:
 *     summary: Get zone by ID
 *     tags:
 *       - Zones
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Zone ID to retrieve
 *     responses:
 *       200:
 *         description: Successfully retrieved zone
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 zone_name:
 *                   type: string
 *                 description:
 *                   type: string
 *       400:
 *         description: Invalid zone ID
 *       404:
 *         description: Zone not found
 *
 * /zone/add:
 *   post:
 *     summary: Add a new zone
 *     tags:
 *       - Zones
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               zone_name:
 *                 type: string
 *                 description: Name of the zone
 *               description:
 *                 type: string
 *                 description: Description of the zone
 *     responses:
 *       201:
 *         description: Zone added successfully
 *       400:
 *         description: Missing required fields or invalid data
 *
 * /zone/update/{id}:
 *   put:
 *     summary: Update zone by ID
 *     tags:
 *       - Zones
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Zone ID to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               zone_name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Zone updated successfully
 *       400:
 *         description: Invalid input data or missing fields
 *       404:
 *         description: Zone not found
 *
 */

router.get("/", getAllZone);
router.get("/about", selectByZone);

router.get("/:id", getByIdZone);
router.post("/add", addZone);
router.put("/update/:id", updateZone);
module.exports = router;
