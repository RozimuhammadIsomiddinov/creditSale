const pool = require("../../config/dbconfig");
const cron = require("node-cron");

const paymentHistoryQuery = `
  SELECT *FROM payment WHERE user_id = $1
`;

//boshqa oy uchun bo'lsa
const insertPaymentOld = `
    INSERT INTO payment (
    user_id,
    collector_id,
    zone_id,
    payment_month,
    payment_amount,
    payment_date,
    description
    )
    VALUES(
    $1,$2,$3,$4,$5,$6,$7,$8
    )
    RETURNING *;
`;

//userni payment va payment statusni yangilaydi
//agar bu oy uchun bo'lsa
const updateUserPaymentQuery = `
    UPDATE users
    SET payment = payment + $1,
        payment_status = true,
        collector = $2
    WHERE id = $3
    RETURNING *;
`;
//agar boshqa oy uchun bo'lsa
const updateUserPaymentOld = `
    UPDATE  users
    SET payment = payment + $1,
        collector = $2
    WHERE id = $3
    RETURNING *;
`;

//to'lovni edit qilish admin tomonidan
const updateQuery = `
    UPDATE payment 
      SET payment_amount = $1,
      payment_month = $2
    WHERE id = $3
    RETURNING *;
`;

// To'lov qo'shish funksiyasi
const addPayment = async (
  user_id,
  collector_id,
  zone_id,
  payment_month,
  paymentAmount,
  payment_date,
  description,
  type
) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN"); // Transactionni boshlash

    //`payments` jadvaliga yangi yozuv qo'shish
    const payment = await client.query(insertPaymentOld, [
      user_id,
      collector_id,
      zone_id,
      payment_month,
      paymentAmount,
      payment_date,
      description,
    ]);

    // `users.payment` ustunini yangilash
    if (type == false) {
      var updatedUser = await client.query(updateUserPaymentQuery, [
        paymentAmount,
        collector_id,
        user_id,
      ]);
    }
    updatedUser = await client.query(updateUserPaymentOld, [
      paymentAmount,
      collector_id,
      user_id,
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

//id payment historyniki
const updatePaymentHistory = async (id, newAmount, newMonth) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const oldPaymentRes = await client.query(
      "SELECT user_id, payment_amount FROM payment WHERE id = $1",
      [id]
    );

    if (oldPaymentRes.rows.length === 0) {
      throw new Error("Payment not found");
    }

    const { user_id, payment_amount: oldAmount } = oldPaymentRes.rows[0];

    const updatedPaymentRes = await client.query(updateQuery, [
      newAmount,
      newMonth,
      id,
    ]);

    if (updatedPaymentRes.rows.length === 0) {
      throw new Error("Failed to update payment");
    }

    const amountDifference = newAmount - oldAmount;
    await client.query(
      "UPDATE users SET payment = payment + $1 WHERE id = $2",
      [amountDifference, user_id]
    );

    await client.query("COMMIT");
    return updatedPaymentRes.rows[0];
  } catch (e) {
    await client.query("ROLLBACK");
    console.error("Error executing updatePaymentHistory:", e.message);
  } finally {
    client.release();
  }
};

module.exports = { addPayment, paymentHistory, updatePaymentHistory };
