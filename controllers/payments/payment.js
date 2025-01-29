const { getByNameCollector } = require("../collector/model");
const { getById } = require("../users/model");
const { addPayment, paymentHistory } = require("./model");

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

const addPaymentAmount = async (req, res) => {
  const { id } = req.params;

  const { amount, collector, payment_month, description } = req.body;

  if (!id) return res.status(400).json({ message: "please send user's id" });

  const res1 = await getById(id);

  if (res1.length == 0)
    return res.status(404).json({ message: "user has not" });

  const res2 = await getByNameCollector(collector);
  if (res2.length == 0)
    return res.status(404).json({
      message: "collector name has not\n please enter true collector name",
    });
  const amountNumber = parseFloat(amount);
  if (!amount || typeof amountNumber !== "number" || amount <= 0)
    return res
      .status(400)
      .json({ message: "Please send a valid amount in correct format" });

  try {
    const result = await addPayment(
      id,
      collector,
      payment_month,
      amountNumber,
      description
    );
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
module.exports = { addPaymentAmount, getPaymentHistory };
