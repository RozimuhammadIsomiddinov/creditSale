const express = require("express");
const cors = require("cors");
require("dotenv").config();

const {
  getAllUsers,
  getByIdUser,
  addUser,
  updateUser,
} = require("./controllers/users/users");

const {
  addPaymentAmount,
  getPaymentHistory,
} = require("./controllers/payments/payment");

const {
  getAllMoney,
  getPrimaryPayment,
  getPrimaryPaymentUsers,
  getThisMonthMoney,
  getMonthUsers,
} = require("./controllers/main/main");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

app.get("/users", getAllUsers);
app.get("/users/:id", getByIdUser);
app.get("/user-payment-history/:id", getPaymentHistory);
app.get("/all-money", getAllMoney);
app.get("/primary-payment", getPrimaryPayment);
app.get("/primary-payment-users", getPrimaryPaymentUsers);
app.get("/view-month-income", getThisMonthMoney);
app.get("/view-month-users", getMonthUsers);

app.post("/add-user", addUser);
app.post("/add-payment/:id", addPaymentAmount);

app.put("/update-user/:id", updateUser);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
