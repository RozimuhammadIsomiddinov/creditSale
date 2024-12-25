const {
  selectIncome,
  selectPrimaryPayment,
  selectPrimaryUsers,
  selectThisMonth,
  selectMonthPaid,
} = require("./model");

const getAllMoney = async (req, res) => {
  try {
    const result = await selectIncome();
    res.status(200).json({ result });
  } catch (e) {
    res
      .status(400)
      .json({ message: "Error from getAllMoney", error: e.message });
  }
};

const getPrimaryPayment = async (req, res) => {
  try {
    const result = await selectPrimaryPayment();
    res.status(200).json(result);
  } catch (e) {
    res
      .status(400)
      .json({ message: "Error from getPrimaryPayment", error: e.message });
  }
};

const getPrimaryPaymentUsers = async (req, res) => {
  const { page } = req.query;
  if (!page)
    return res.status(400).json({ message: "please send page number" });

  try {
    const result = await selectPrimaryUsers(page);
    res.status(200).json(result);
  } catch (e) {
    res
      .status(400)
      .json({ message: "Error from getPrimaryPaymentUsers", error: e.message });
  }
};

const getThisMonthMoney = async (req, res) => {
  try {
    const result = await selectThisMonth();
    res.status(200).json(result);
  } catch (e) {
    res
      .status(400)
      .json({ message: "Error from getThisMonthMoney", error: e.message });
  }
};

const getMonthUsers = async (req, res) => {
  const { page } = req.query;
  if (!page)
    return res.status(400).json({ message: "please send page number" });

  try {
    const { rows, res: res1 } = await selectMonthPaid(page);
    res.status(200).json({ rows, count: res1.rows.length });
  } catch (e) {
    res
      .status(400)
      .json({ message: "Error from getMonthUsers", error: e.message });
  }
};
module.exports = {
  getAllMoney,
  getPrimaryPayment,
  getPrimaryPaymentUsers,
  getThisMonthMoney,
  getMonthUsers,
};
