const express = require("express");
const {
  getAllZone,
  getByIdZone,
  addZone,
  updateZone,
  filterZoneUsers,
  selectByZone,
} = require("../controllers/zone/zone");

const router = express.Router();
/**
 * @swagger
 * /zones:
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
 * /zones/{id}:
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
 * /zones/add:
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
 * /zones/update/{id}:
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
 * /zones/filter:
 *   post:
 *     summary: Filter users by zone
 *     description: Retrieve a paginated list of users belonging to a specific zone.
 *     tags:
 *       - Zones
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               zone:
 *                 type: string
 *                 description: The name of the zone to filter users.
 *             required:
 *               - zone
 *     parameters:
 *       - in: query
 *         name: page
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: The page number for pagination.
 *     responses:
 *       200:
 *         description: Successfully retrieved users for the specified zone.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   name:
 *                     type: string
 *                   email:
 *                     type: string
 *                   zone:
 *                     type: string
 *       400:
 *         description: Bad request, missing required fields (zone or page).
 *       404:
 *         description: No users found in the specified zone.
 */

router.get("/", getAllZone);
router.get("/about", selectByZone);

router.get("/:id", getByIdZone);

router.post("/add", addZone);
router.put("/update/:id", updateZone);
module.exports = router;
