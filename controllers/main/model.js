const pool = require("../../config/dbconfig");
const { getById } = require("../users/model");
//1.
//hamma pul
const allMoneyQuery = `
    SELECT SUM(cost) FROM users;
`;
//nechta userga sotilgan
const allCountQuery = `
    SELECT COUNT(*) FROM users;
`;

//to'laganlar
const payedUsersMoneyQuery = `
    SELECT SUM(payment) FROM users;
`;

//to'lagan userlar
const payedUsersCountQuery = `
    SELECT COUNT(*) FROM users WHERE payment != 0; 
`;

//2.
//bu oy to'lamaganlar  yani qancha to'lanishi kerak
const selectNotPayedUsersQuery = `
    SELECT * FROM users WHERE payment_status = false LIMIT $1 OFFSET $2;
`;

//bu oy to'lamagan userlar soni
const notPayedUsersQuery = `
    SELECT COUNT(*) FROM users WHERE payment_status = false;
`;

//3.
//bu oy qancha to'laganlar
const sumMonthQuery = `
    SELECT SUM(payment_amount) 
    FROM payment AS p
    WHERE DATE_TRUNC('month', p.payment_date) = DATE_TRUNC('month', CURRENT_DATE);
`;

const countMonthQuery = `
  SELECT COUNT(*) 
    FROM payment AS p
    WHERE DATE_TRUNC('month', p.payment_date) = DATE_TRUNC('month', CURRENT_DATE);
`;
// bu oy to'laganlar ro'yhati
const selectMonthQuery = `
    SELECT user_id 
    FROM payment AS p
    WHERE DATE_TRUNC('month', p.payment_date) = DATE_TRUNC('month', CURRENT_DATE);
`;
//4.
// bugun to'laganlar
const sumDayQuery = `
    SELECT SUM(payment_amount) 
    FROM payment AS p
    WHERE DATE(p.payment_date) = CURRENT_DATE;
`;

//bugun pul nechi marta to'langan soni
const countDayQuery = `
  SELECT COUNT(*) 
    FROM payment AS p
    WHERE DATE(p.payment_date) = CURRENT_DATE;
`;
const selectDayQuery = `
 SELECT user_id 
  FROM payment AS p
    WHERE DATE(p.payment_date) = CURRENT_DATE;
    `;
//1.
const selectIncome = async () => {
  try {
    const res = await pool.query(allMoneyQuery);
    return res.rows[0];
  } catch (e) {
    console.error("Error executing query by selectIncome", e.message);
  }
};
const selectIncomeUsers = async () => {
  try {
    const res = await pool.query(allCountQuery);
    return res.rows[0];
  } catch (e) {
    console.error("Error executing query in getincomeusers", e.message);
  }
};

const payedMoneyUsers = async () => {
  try {
    const res = await pool.query(payedUsersMoneyQuery);
    return res.rows[0];
  } catch (e) {
    console.error("Error executing query in payedUsers", e.message);
  }
};
const payedCountUsers = async () => {
  try {
    const res = await pool.query(payedUsersCountQuery);
    return res.rows[0];
  } catch (e) {
    console.error("Error executing query in payedCountUsers", e.message);
  }
};

//2.
const notPayedUsers = async (page = 1, limit = 20) => {
  const offset = (page - 1) * limit;

  try {
    const res = await pool.query(selectNotPayedUsersQuery, [limit, offset]);
    return res.rows;
  } catch (e) {
    console.error("Error executing query in notpayedusers", e.message);
  }
};

const notPayedUsersCount = async () => {
  try {
    const res = await pool.query(notPayedUsersQuery);
    return res.rows[0];
  } catch (e) {
    console.error("Error executing query in notpayed count", e.message);
  }
};

//3.

const sumMonth = async () => {
  try {
    const res = await pool.query(sumMonthQuery);
    return res.rows[0];
  } catch (e) {
    console.error("Error executing query in summonth", e.message);
  }
};

const selectMonth = async () => {
  try {
    const { rows } = await pool.query(selectMonthQuery);
    //bir xil id liklarni bitta qildim yani faqat qaysi user to'lov qilganini ko'rsatdim
    const uniqueUserIds = [...new Set(rows.map((item) => item.user_id))];
    const results = await Promise.all(
      uniqueUserIds.map((userId) => getById(userId))
    );

    return results;
  } catch (e) {
    console.error("Error executing query in selectMonth", e.message);
  }
};

const countMonth = async () => {
  try {
    const res = await pool.query(countMonthQuery);
    return res.rows[0];
  } catch (e) {
    console.error("Error executing query by countMonth", e.message);
  }
};

//4.
const sumDay = async () => {
  try {
    const res = await pool.query(sumDayQuery);
    return res.rows[0];
  } catch (e) {
    console.error("Error executing query by sumday", e.message);
  }
};

const countDay = async () => {
  try {
    const res = await pool.query(countDayQuery);
    return res.rows[0];
  } catch (e) {
    console.error("Error executing query by countday", e.message);
  }
};

const selectDay = async () => {
  try {
    const { rows } = await pool.query(selectDayQuery);

    //bir xil id liklarni bitta qildim yani faqat qaysi user to'lov qilganini ko'rsatdim
    const uniqueUserIds = [...new Set(rows.map((item) => item.user_id))];
    const results = await Promise.all(
      uniqueUserIds.map((userId) => getById(userId))
    );

    return results;
  } catch (e) {
    console.error("Error executing query by selectday", e.message);
  }
};

module.exports = {
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
};
