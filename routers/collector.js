const express = require("express");
const {
  getAllCollector,
  getCollectorMoney,
  getByIdCollectorCont,
} = require("../controllers/collector/collector");
const { loginCollector } = require("../controllers/collector/page/login.js");
const { auth } = require("../middleware/auth");
const {
  filterByZoneBoolean,
  filterByZoneAndWorkplace,
} = require("../controllers/collector/page/filter.js");
const {
  selectThisOldMonthByID,
} = require("../controllers/collector/page/statistic.js");

const router = express.Router();

/**
 * @swagger
 * /collector/login:
 *   post:
 *     summary: Collector login
 *     tags: [Collectors]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               login:
 *                 type: string
 *                 example: "collector123"
 *               password:
 *                 type: string
 *                 example: "password123"
 *     responses:
 *       200:
 *         description: Successfully logged in
 *       401:
 *         description: Incorrect password
 *       404:
 *         description: Collector not found
 */
/**
 * @swagger
 * /collector/statistic-by-users-all/{id}:
 *   post:
 *     summary: Filter collectors by zone
 *     tags: [Collectors-Filter]
 *     parameters:
 *       - in: query
 *         name: page
 *         required: true
 *         description: Number of page
 *         example: 1
 *         schema:
 *           type: integer
 *       - in: path
 *         name: id
 *         required: true
 *         description: Collector ID
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Successfully filtered collectors
 *       400:
 *         description: Missing fields or invalid format
 *       404:
 *         description: Zone not found
 */

/**
 * @swagger
 * /collector/statistic-by-users-zone:
 *   post:
 *     summary: Filter collectors by zone, workplace, and payment status
 *     tags: [Collectors-Filter]
 *     parameters:
 *       - in: query
 *         name: page
 *         required: true
 *         description: page for pagination
 *         schema:
 *           type: integer
 *           example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               collector_id:
 *                type: integer
 *                example: 1
 *               zone_id:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       200:
 *         description: Successfully filtered collectors
 *       400:
 *         description: Missing fields or invalid format
 *       404:
 *         description: Zone or workplace not found
 */

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
 * /collector/statistic/{id}:
 *   get:
 *     summary: Get statistics for the selected collector for this and last month
 *     tags: [Collectors]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the collector
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Successfully retrieved statistics for this and last month
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 this_month:
 *                   type: object
 *                   properties:
 *                     rowCount:
 *                       type: integer
 *                       example: 2
 *                     rows:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           zone_name:
 *                             type: string
 *                             example: "Zon 1"
 *                           login:
 *                             type: string
 *                             example: "collector123"
 *                           total_payment:
 *                             type: number
 *                             format: float
 *                             example: 1500.00
 *                 old_month:
 *                   type: object
 *                   properties:
 *                     rowCount:
 *                       type: integer
 *                       example: 3
 *                     rows:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           zone_name:
 *                             type: string
 *                             example: "Zon 1"
 *                           login:
 *                             type: string
 *                             example: "collector123"
 *                           total_payment:
 *                             type: number
 *                             format: float
 *                             example: 1200.00
 *       400:
 *         description: Bad request, missing collector ID
 *       404:
 *         description: Collector not found
 */

router.get("/", getAllCollector);
router.get("/statistic/:id", selectThisOldMonthByID);
router.get("/all-money", getCollectorMoney);
router.get("/:id", getByIdCollectorCont);
router.post("/login", loginCollector);

router.post("/statistic-by-users-all/:id", filterByZoneBoolean); //opshi vaqtdagi collectorga tegishli to'lov qilgan userlar ro'yhati

router.post("/statistic-by-users-zone", filterByZoneAndWorkplace);

module.exports = router;
