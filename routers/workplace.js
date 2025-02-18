const express = require("express");
const {
  selectAllWorkplace,
  selectByIDWorkplace,
  addWorkplace,
  filterWorkplace,
  updateWorkplace,
} = require("../controllers/workplace/workplace");

const router = express.Router();

/**
 * @swagger
 * /workplace:
 *   get:
 *     summary: Get all workplaces
 *     tags:
 *       - Workplaces
 *     responses:
 *       200:
 *         description: A list of workplaces
 *       404:
 *         description: Workplaces have not yet!
 *
 * /workplace/{id}:
 *   get:
 *     summary: Get a workplace by ID
 *     tags:
 *       - Workplaces
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Workplace ID
 *     responses:
 *       200:
 *         description: Workplace data
 *       400:
 *         description: Please send user's id
 *       404:
 *         description: Workplace not found
 *
 * /workplace/add:
 *   post:
 *     summary: Add a new workplace
 *     tags:
 *       - Workplaces
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               workplace_name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Workplace added successfully!
 *       400:
 *         description: Please provide required workplace_name
 *
 * /workplace/update/{id}:
 *   put:
 *     summary: Update a workplace
 *     tags:
 *       - Workplaces
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               workplace_name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Workplace updated successfully!
 *       400:
 *         description: Please provide required workplace_name
 *       404:
 *         description: Workplace not found
 *
 * /workplace/filter/{id}:
 *   post:
 *     summary: Filter workplaces
 *     tags:
 *       - Workplaces
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: page
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Filtered workplaces
 *       400:
 *         description: Please send workplace's id and page number
 *       404:
 *         description: Workplace not found
 */

router.get("/", selectAllWorkplace);
router.get("/:id", selectByIDWorkplace);
router.post("/add", addWorkplace);
router.post("/filter/:id", filterWorkplace);
router.put("/update/:id", updateWorkplace);

module.exports = router;
