import logger from "@infrastructure/logger/logger";
import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

/**
 * Initialise la connexion à la base de données.
 *
 * @throws {Error} Si la connexion échoue.
 */
async function connectToDB(): Promise<void> {
  mongoose
    .connect(`${process.env.MONGO_URI}`)
    .then((res) => {
      if (res) {
        logger.info("Connexion à la base de données réussie.");
      }
    })
    .catch((err) => {
      logger.error("Erreur de connexion à la base de données :", err);
    });
}

export default connectToDB;
