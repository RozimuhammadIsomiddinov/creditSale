const express = require("express");
const cors = require("cors");
require("dotenv").config();

const routerWorkplace = require("./routers/workplace");

const routerUsers = require("./routers/users");
const routerPayment = require("./routers/payments");
const routerZone = require("./routers/zones");
const routerCollector = require("./routers/collector");
const routerMain = require("./routers/main");
const routerAdmin = require("./routers/admin");

const { getByZone } = require("./controllers/sender/sender");

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
const { auth } = require("./middleware/auth");

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
  apis: ["./routers/*.js"],
};

const specs = swaggerJsdoc(options);

app.use("/admin", routerAdmin);
app.use("/collector", routerCollector);
app.use("/main", routerMain);
app.use("/payment", routerPayment);
app.use("/users", routerUsers);
app.use("/workplace", routerWorkplace);
app.use("/zone", routerZone);
app.get("/excel-download", getByZone);

app.use("/api-swagger", swaggerUi.serve, swaggerUi.setup(specs));

const PORT = process.env.PORT;
app.listen(PORT);
