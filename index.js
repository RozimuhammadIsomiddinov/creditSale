const express = require("express");
const cors = require("cors");
require("./lib/cron.js");
require("dotenv").config();

const routerWorkplace = require("./routers/workplace");

const routerUsers = require("./routers/users");
const routerPayment = require("./routers/payments");
const routerZone = require("./routers/zones");
const routerCollector = require("./routers/collector");
const routerMain = require("./routers/main");
const routerAdmin = require("./routers/admin");
const routerRecycle = require("./routers/recycle.js");
const { getByZone, getAllZoneXLSX } = require("./controllers/sender/sender");

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
        url: "https://creditsale.uz/api",
      },
    ],
  },
  apis: ["./routers/*.js"],
};

const specs = swaggerJsdoc(options);

app.use("/api/admin", routerAdmin);
app.use("/api/collector", routerCollector);
app.use("/api/main", routerMain);
app.use("/api/payment", routerPayment);
app.use("/api/users", routerUsers);
app.use("/api/workplace", routerWorkplace);
app.use("/api/zone", routerZone);
app.use("/api/recycle", routerRecycle);
app.get("/api/excel-download", getByZone);
app.get("/api/excel-download-all", getAllZoneXLSX);

app.use("/api/api-swagger", swaggerUi.serve, swaggerUi.setup(specs));

const PORT = process.env.PORT;
app.listen(PORT);
