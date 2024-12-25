const express = require("express");
const cors = require("cors");
require("dotenv").config();

const routerUsers = require("./routers/users");
const routerPayment = require("./routers/payments");
const routerReturns = require("./routers/returns");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "CreditSale API",
      version: "1.0.0",
      description: "This is the API documentation for CreditSale.",
    },
    servers: [
      {
        url: "http://localhost:7045",
      },
    ],
  },
  apis: ["./routers/*.js"], // Hujjatlangan fayllar joylashuvi
};

const specs = swaggerJsdoc(options);

app.use("/users", routerUsers);
app.use("/payment", routerPayment);
app.use("/returns", routerReturns);

app.use("/api-swagger", swaggerUi.serve, swaggerUi.setup(specs));

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
