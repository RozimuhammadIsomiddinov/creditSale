const pool = require("../../config/dbconfig");
const cron = require("node-cron");

const paymentHistoryQuery = `
  SELECT *FROM payments WHERE user_id = $1
`;

const insertPaymentHistoryQuery = `
    INSERT INTO payments (
    user_id,
    collector,
    payment_month,
    payment_amount,
    payment_date,
    description
    )
    VALUES(
    $1,$2,$3,$4,NOW(),$5
    )
    RETURNING *;
`;

//userni payment va payment statusni yangilaydi
const updateUserPaymentQuery = `
    UPDATE users
    SET payment = payment + $1,
        payment_status = true 
    WHERE id = $2
    RETURNING *;
`;

// To'lov qo'shish funksiyasi
const addPayment = async (
  userId,
  collector,
  payment_month,
  paymentAmount,
  description
) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN"); // Transactionni boshlash

    //`payments` jadvaliga yangi yozuv qo'shish
    const payment = await client.query(insertPaymentHistoryQuery, [
      userId,
      collector,
      payment_month,
      paymentAmount,
      description,
    ]);

    // `users.payment` ustunini yangilash
    const updatedUser = await client.query(updateUserPaymentQuery, [
      paymentAmount,
      userId,
    ]);
    //har kuni soat 00:00 da tekshirib, 30 kun o'tgan user_id lar uchun payment_status ni false qilib qo'yadi
    cron.schedule("0 0 * * *", async () => {
      try {
        const result = await pool.query(`
      UPDATE users
      SET payment_status = false
      WHERE NOW() - INTERVAL '30 days' >= (SELECT MAX(payment_date) FROM payments WHERE payments.user_id = users.id)
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

    await client.query("COMMIT"); // Transactionni yakunlash
    return {
      payment: payment.rows[0],
      updatedUser: updatedUser.rows[0],
    };
  } catch (e) {
    await client.query("ROLLBACK"); // Xatolik bo'lsa transactionni bekor qilish
    console.error("Error in addPayment:", e.message);
  } finally {
    client.release(); // Connectionni bo'shatish
  }
};

const paymentHistory = async (id) => {
  try {
    const res = await pool.query(paymentHistoryQuery, [id]);
    return res.rows;
  } catch (e) {
    console.error("Error executing query by paymentHistory", e.message);
  }
};

module.exports = { addPayment, paymentHistory };
