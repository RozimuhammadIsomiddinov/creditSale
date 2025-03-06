const express = require("express");
const {
  put_recycle,
  delete_recycle,
} = require("../controllers/recycle/recycle");

const router = express.Router();

/**
 * @swagger
 * /recycle/to/{id}:
 *   put:
 *     tags:
 *       - Recycle
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: user's id
 *     responses:
 *       200:
 *         description: User data updated successfully
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 *
 * /recycle/out/{id}:
 *   delete:
 *     tags:
 *       - Recycle
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: user's id
 *     responses:
 *       200:
 *         description: User successfully deleted from recycle
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */

router.put("/to/:id", put_recycle);
router.delete("/out/:id", delete_recycle);

module.exports = router;
