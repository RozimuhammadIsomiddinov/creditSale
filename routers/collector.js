const express = require("express");
const {
  getAllCollector,
  getByIdCollector,
  addCollector,
  updateCollector,
  getCollectorMoney,
} = require("../controllers/collector/collector");

const router = express.Router();

/**
 * @swagger
 * /collector:
 *   get:
 *     summary: Get all collectors
 *     tags: [Collectors]
 *     responses:
 *       200:
 *         description: Successfully retrieved collectors
 *       404:
 *         description: No collectors found
 */

/**
 * @swagger
 * /collector/all-money:
 *   get:
 *     summary: Get total money collected
 *     tags: [Collectors]
 *     responses:
 *       200:
 *         description: Successfully retrieved collected money
 *       400:
 *         description: Error occurred while fetching data
 */

/**
 * @swagger
 * /collector/{id}:
 *   get:
 *     summary: Get a collector by ID
 *     tags: [Collectors]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Collector ID
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Successfully retrieved collector
 *       404:
 *         description: Collector not found
 */

/**
 * @swagger
 * /collector/add:
 *   post:
 *     summary: Add a new collector
 *     tags: [Collectors]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               collector_name:
 *                 type: string
 *                 example: "John Doe"
 *               description:
 *                 type: string
 *                 example: "Experienced money collector"
 *     responses:
 *       201:
 *         description: Collector added successfully
 *       400:
 *         description: Error occurred while adding collector
 */

/**
 * @swagger
 * /collector/update/{id}:
 *   put:
 *     summary: Update a collector
 *     tags: [Collectors]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Collector ID
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               collector_name:
 *                 type: string
 *                 example: "Updated Name"
 *               description:
 *                 type: string
 *                 example: "Updated description"
 *     responses:
 *       201:
 *         description: Collector updated successfully
 *       400:
 *         description: Error occurred while updating collector
 *       404:
 *         description: Collector not found
 */
router
  .get("/", getAllCollector)
  .get("/all-money", getCollectorMoney)
  .get("/:id", getByIdCollector)
  .post("/add", addCollector)
  .put("/update/:id", updateCollector);

module.exports = router;
