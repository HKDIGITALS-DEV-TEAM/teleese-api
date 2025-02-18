import winston from "winston";
import fs from "fs";
import path from "path";

// Définition du dossier de logs
const logDir = "logs";

// Création du dossier s'il n'existe pas
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

// Configuration des niveaux de logs
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

// Création du logger Winston
const logger = winston.createLogger({
  levels,
  format: winston.format.combine(
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    winston.format.printf(
      ({ timestamp, level, message }) =>
        `[${timestamp}] ${level.toUpperCase()}: ${message}`
    )
  ),
  transports: [
    new winston.transports.Console({
      level: "debug",
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    }),
    new winston.transports.File({
      filename: path.join(logDir, "error.log"),
      level: "error",
    }),
    new winston.transports.File({
      filename: path.join(logDir, "combined.log"),
    }),
  ],
});

// Export du logger
export default logger;
