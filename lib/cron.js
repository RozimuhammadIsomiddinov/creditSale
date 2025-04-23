const cron = require("node-cron");
const pool = require("../config/dbconfig");

// Har oy 1-kuni soat 00:00 da ishlaydi
cron.schedule("0 0 1 * *", async () => {
  try {
    const result = await pool.query(`
      UPDATE users
      SET payment_status = false
      WHERE payment_status = true
      AND (
        SELECT MAX(payment_date) 
        FROM payment 
        WHERE payment.user_id = users.id
      ) IS NOT NULL
      AND (
        SELECT MAX(payment_date) 
        FROM payment 
        WHERE payment.user_id = users.id
      ) < DATE_TRUNC('month', NOW())
      RETURNING *;
    `);

    if (result.rows.length > 0) {
      console.log("Payment status updated for users:", result.rows);
    } else {
      console.log("No users found for payment status reset.");
    }
  } catch (err) {
    console.error("Error resetting payment status:", err.message);
  }
});

module.exports = cron;
