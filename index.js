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
const allowedOrigins = [
  "https://credit-sale-front.vercel.app",
  "https://credit-sale-pro.vercel.app",
  "http://localhost:5173",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
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

app.use("/admin", routerAdmin);
app.use("/collector", routerCollector);
app.use("/main", routerMain);
app.use("/payment", routerPayment);
app.use("/users", routerUsers);
app.use("/workplace", routerWorkplace);
app.use("/zone", routerZone);
app.use("/recycle", routerRecycle);
app.get("/excel-download", getByZone);
app.get("/excel-download-all", getAllZoneXLSX);
app.use("/api-swagger", swaggerUi.serve, swaggerUi.setup(specs));

const PORT = process.env.PORT;
app.listen(PORT);
