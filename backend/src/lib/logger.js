import { createLogger, format, transports } from "winston";
import chalk from "chalk";

// Define log colors
const logColors = {
  error: chalk.red,
  warn: chalk.hex("#FFA500"),
  info: chalk.blue,
  debug: chalk.hex("#800080"),
  success: chalk.green,
};

const logger = createLogger({
  level: "debug", // Set the minimum log level (debug, info, warn, error)
  format: format.combine(
    format.timestamp(),
    format.printf(({ timestamp, level, message }) => {
      const colorizer = logColors[level] || ((text) => text); // Apply color if available
      return colorizer(`[${timestamp}] ${level.toUpperCase()}: ${message}`);
    })
  ),
  transports: [
    new transports.Console(), // Logs to the console
    // new transports.File({ filename: "server.log" }), // Logs to a file
  ],
});

// Custom success log level
logger.success = (message) => logger.info(logColors.success(message));

export default logger;
