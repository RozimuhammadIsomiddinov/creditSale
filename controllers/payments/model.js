const pool = require("../../config/dbconfig");

const paymentHistoryQuery = `
 SELECT
  p.id,
  p.user_id,
  zone.zone_name AS zone_name,
  collector.login AS login,
  p.payment_month,
  p.payment_amount,
  p.payment_date,
  p.updated_at,
  p.description
FROM payment AS p
JOIN zone ON p.zone_id = zone.id
JOIN collector ON p.collector_id = collector.id

  WHERE p.user_id = $1;
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
    $1,$2,$3,$4,$5,$6,$7
    )
    RETURNING *;
`;

//userni payment va payment statusni yangilaydi
//agar bu oy uchun bo'lsa
const updateUserPaymentQuery = `
    UPDATE users
SET 
    payment = payment + $1, 
    payment_status = CASE 
        WHEN payment_status = false THEN true 
        ELSE payment_status 
    END
WHERE id = $2
RETURNING *;

`;
//agar boshqa oy uchun bo'lsa
const updateUserPaymentOld = `
    UPDATE  users
    SET payment = payment + $1
    WHERE id = $2
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
    await client.query("BEGIN");

    const payment = await client.query(insertPaymentOld, [
      user_id,
      collector_id,
      zone_id,
      payment_month,
      paymentAmount,
      payment_date,
      description,
    ]);

    const updatedUser = await client.query(
      type == true ? updateUserPaymentQuery : updateUserPaymentOld,
      [paymentAmount, user_id]
    );

    await client.query("COMMIT");
    return {
      payment: payment.rows[0],
      updatedUser: updatedUser.rows[0],
    };
  } catch (e) {
    await client.query("ROLLBACK");
    console.error("Error in addPayment:", e.message);
  } finally {
    client.release();
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
/*
const maxPayment = async (id) => {
  try {
    const { rows } = await pool.query(paymentHistoryQuery, [id]);
    const maxItems = rows.map((a) => a.id);
    const maxNumber = Math.max(...maxItems);
    const res = await pool.query("select * from payment where id = $1", [
      maxNumber,
    ]);
    return res.rows[0].payment_amount;
  } catch (e) {
    console.error("Error executing query by maxPayment", e.message);
  }
};
*/
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

module.exports = {
  addPayment,
  paymentHistory,
  updatePaymentHistory,
  // maxPayment,
};
