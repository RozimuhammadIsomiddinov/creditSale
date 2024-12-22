const { addPayment, paymentHistory } = require("./model");

const addPaymentAmount = async (req, res) => {
  const { id } = req.params;
  if (!id) return res.status(400).json({ message: "please send user's id" });

  const { amount } = req.body;
  const amountNumber = parseFloat(amount);
  if (!amount || typeof amountNumber !== "number" || amount <= 0)
    return res
      .status(400)
      .json({ message: "Please send a valid amount in correct format" });

  try {
    const result = await addPayment(id, amountNumber);
    // Foydalanuvchi yoki to‘lov topilmagan bo‘lsa

    if (!result || !result.updatedUser) {
      return res
        .status(404)
        .json({ message: "User not found or update failed" });
    }
    // Muvaffaqiyatli holatda javob qaytarish
    return res.status(201).json({
      message: "Payment added successfully",
      payment: result.payment,
      user: result.updatedUser,
    });
  } catch (e) {
    res
      .status(400)
      .json({ message: "Error while adding payment", error: e.message });
  }
};

const getPaymentHistory = async (req, res) => {
  const { id } = req.params;
  if (!id) return res.status(400).json({ message: "please send user's id" });
  try {
    const result = await paymentHistory(id);
    if (result.length == 0)
      return res
        .status(404)
        .json({ message: "user's payment history has not" });
    res.status(200).json({ result });
  } catch (e) {
    res
      .status(400)
      .json({ message: "Error from getPaymentHistory", error: e.message });
  }
};
module.exports = { addPaymentAmount, getPaymentHistory };
