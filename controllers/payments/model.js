const pool = require("../../config/dbconfig");

const insertPaymentHistoryQuery = `
    INSERT INTO payments (
    user_id,
    payment_amount,
    payment_date
    )
    VALUES(
    $1,$2,NOW()
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
const paymentHistoryQuery = `
  SELECT *FROM payments WHERE user_id = $1
`;
// To'lov qo'shish funksiyasi
const addPayment = async (userId, paymentAmount) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN"); // Transactionni boshlash

    // 1. `payments` jadvaliga yangi yozuv qo'shish
    const payment = await client.query(insertPaymentHistoryQuery, [
      userId,
      paymentAmount,
    ]);

    // 2. `users.payment` ustunini yangilash
    const updatedUser = await client.query(updateUserPaymentQuery, [
      paymentAmount,
      userId,
    ]);

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
