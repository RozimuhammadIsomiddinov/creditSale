const { getByIdCollector } = require("../collector/model");
const { getById } = require("../users/model");
const { addPayment, paymentHistory, updatePaymentHistory } = require("./model");

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

  const {
    amount,
    collector_id,
    zone_id,
    payment_month,
    payment_date,
    type,
    description,
  } = req.body;

  if (!id) return res.status(400).json({ message: "please send user's id" });

  const res1 = await getById(id);

  if (res1.length == 0)
    return res.status(404).json({ message: "user has not" });

  const res2 = await getByIdCollector(collector_id);
  if (res2.length == 0)
    return res.status(404).json({
      message: "collector has not",
    });
  const amountNumber = parseFloat(amount);
  if (isNaN(amountNumber)) {
    return res.status(400).json({ message: "Please send a valid amount" });
  }
  try {
    const result = await addPayment(
      id,
      collector_id,
      zone_id,
      payment_month,
      amountNumber,
      payment_date,
      description,
      type
    );
    if (!result || !result.updatedUser) {
      return res
        .status(404)
        .json({ message: "User not found or update failed" });
    }

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
const updatePaymentAmount = async (req, res) => {
  const { id } = req.params;
  const { amount, payment_month } = req.body;

  if (!id) return res.status(400).json({ message: "please send payment id" });

  const newAmount = parseFloat(amount);
  if (isNaN(newAmount)) {
    return res.status(400).json({ message: "Please send a valid amount" });
  }

  try {
    const updatedPayment = await updatePaymentHistory(
      id,
      newAmount,
      payment_month
    );

    if (!updatedPayment) {
      return res
        .status(404)
        .json({ message: "Payment not found or update failed" });
    }

    res.status(200).json({
      message: "Payment updated successfully",
      payment: updatedPayment,
    });
  } catch (e) {
    res
      .status(400)
      .json({ message: "Error while updating payment", error: e.message });
  }
};

module.exports = { addPaymentAmount, getPaymentHistory, updatePaymentAmount };
