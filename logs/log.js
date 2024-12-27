const { createLogger, transports, format } = require("winston");
const path = require("path");
const fs = require("fs");
const { combine, timestamp, json, prettyPrint } = format;
const logFilePath = path.join(__dirname, "log.txt");

if (!fs.existsSync(logFilePath)) {
  fs.writeFileSync(logFilePath, "", { flag: "wx" });
}

const logger = createLogger({
  level: "info",
  format: combine(
    timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    json(),
    prettyPrint()
  ),
  transports: [
    new transports.File({ filename: path.join(__dirname, "log.txt") }),
  ],
});
const loggerReturns = createLogger({
  level: "info",
  format: combine(
    timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    json(),
    prettyPrint()
  ),
  transports: [
    new transports.File({ filename: path.join(__dirname, "returns.txt") }),
  ],
});
module.exports = { logger, loggerReturns };
