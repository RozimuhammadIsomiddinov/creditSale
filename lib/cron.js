const cron = require("node-cron");

cron.schedule("*/1 * * * *", async () => {
  try {
    const result = await pool.query(`
        UPDATE users
        SET payment_status = false
        WHERE (
          SELECT MAX(payment_date) 
          FROM payment 
          WHERE payment.user_id = users.id
        ) IS NOT NULL 
        AND (
          SELECT MAX(payment_date) 
          FROM payment 
          WHERE payment.user_id = users.id
        ) < NOW() - INTERVAL '1 minute'
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
