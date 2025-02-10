const {
  selectIncome,
  selectDay,
  countDay,
  sumDay,
  countMonth,
  selectMonth,
  sumMonth,
  notPayedUsersCount,
  notPayedUsers,
  payedCountUsers,
  payedMoneyUsers,
  selectIncomeUsers,
} = require("./model");

const getAllMoney = async (req, res) => {
  try {
    const result1 = await selectIncome(); // Barcha pul miqdorini olish
    const result2 = await selectIncomeUsers(); // Hamma foydalanuvchilar sonini olish
    const result3 = await payedMoneyUsers(); // To'langan pul miqdorini olish
    const result4 = await payedCountUsers(); // To'langan foydalanuvchilar sonini olish

    res.status(200).json({
      all_income: result1,
      income_users_count: result2,
      paid_money: result3,
      paid_users_count: result4,
    });
  } catch (e) {
    res
      .status(400)
      .json({ message: "Error from getAllMoney", error: e.message });
  }
};

const getNotPayedUsers = async (req, res) => {
  const { page } = req.query;
  try {
    const { count } = await notPayedUsersCount();
    const result1 = await selectIncome();
    const result2 = await payedMoneyUsers();
    const sum = Number(result1.sum) - Number(result2.sum);
    const result3 = await notPayedUsers(page ? page : 1);
    res.status(200).json({ count, sum, result: result3 });
  } catch (e) {
    res
      .status(400)
      .json({ message: "Error from getNotPayedUsers", error: e.message });
  }
};

const getMonthSum = async (req, res) => {
  try {
    const { sum } = await sumMonth();
    const { count } = await countMonth();
    const result3 = await selectMonth();

    res.status(200).json({ sum, count, result: result3 });
  } catch (e) {
    res
      .status(400)
      .json({ message: "Error from getMonthSum", error: e.message });
  }
};

const getTodaySum = async (req, res) => {

  try {
    const { sum } = await sumDay();
    const { count } = await countDay();
    const result3 = await selectDay();

    res.status(200).json({ sum, count, result: result3 });
  } catch (e) {
    res
      .status(400)
      .json({ message: "Error from getTodaySum", error: e.message });
  }
};

module.exports = {
  getAllMoney,

  getNotPayedUsers,

  getMonthSum,

  getTodaySum,
};
