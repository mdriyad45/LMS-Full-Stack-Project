const { createLogger, format, transports } = require("winston")
const path = require("path")

const { combine, timestamp, printf, colorize } = format

// Correct format function that receives the info object
const logFormat = printf((info) => {
  return `[${info.timestamp}] ${info.level}: ${info.message}`
})

const logger = createLogger({
  level: "info",
  format: combine(timestamp({ format: "YYYY-MM-DD HH:mm:ss" }), colorize(), logFormat),
  transports: [
    new transports.Console(),
    new transports.File({
      filename: path.join(__dirname, "../logs/error.log"),
      level: "error",
    }),
    new transports.File({
      filename: path.join(__dirname, "../logs/combined.log"),
    }),
  ],
})

module.exports = logger
