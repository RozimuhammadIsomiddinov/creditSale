const express = require("express");
const {
  getAllCollector,
  getByIdCollector,
  updateCollector,
  getCollectorMoney,
} = require("../controllers/collector/collector");
const { loginCollector } = require("../controllers/collector/page/login.js");
const { auth } = require("../middleware/auth");
const {
  filterByZoneBoolean,
  filterByZoneAndWorkplace,
} = require("../controllers/collector/page/filter.js");

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
 * /collector/filter:
 *   post:
 *     summary: Filter collectors by zone and payment status
 *     tags: [Collectors]
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
 *               payment_status:
 *                 type: boolean
 *                 example: true
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
 * /collector/filter-all:
 *   post:
 *     summary: Filter collectors by zone, workplace, and payment status
 *     tags: [Collectors]
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
 *                 example: 10
 *               payment_status:
 *                 type: boolean
 *                 example: false
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

router.post("/login", loginCollector);
router.post("/filter", filterByZoneBoolean);
router.post("/filter-all", filterByZoneAndWorkplace);

router.get("/", auth, getAllCollector);
router.get("/all-money", getCollectorMoney);
router.get("/:id", getByIdCollector);

module.exports = router;
