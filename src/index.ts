import logger from "@infrastructure/logger/logger";
import { app } from "./app";

// Démarrer le serveur
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  logger.info(`Serveur démarré sur le port ${PORT}`);
  logger.info(
    `Swagger disponible sur ${
      process.env.API_HOSTNAME || "http://localhost:3000"
    }/${process.env.API_PREFIX || "api/v1"}/docs`
  );
});
