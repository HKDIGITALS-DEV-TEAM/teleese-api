import logger from "@infrastructure/logger/logger";
import dotenv from "dotenv";
import path from "path";

// Détecter l'environnement actuel
const ENVIRONMENT = process.env.NODE_ENV || "dev";

// Charger les variables d'environnement en fonction de l'environnement actif
const envFile = path.resolve(__dirname, `../../../.env.${ENVIRONMENT}`);
dotenv.config({ path: envFile });

/**
 * Configuration centralisée des variables d'environnement
 */
export const config = {
  environment: ENVIRONMENT,
  port: process.env.PORT || 3000,
  mongoUri: process.env.MONGO_URI || "mongodb://localhost:27017/teleese",
  keycloak: {
    url: process.env.KEYCLOAK_URL,
    clientId: process.env.KEYCLOAK_CLIENT_ID,
    realm: process.env.KEYCLOAK_REALM,
    clientSecret: process.env.KEYCLOAK_CLIENT_SECRET,
  },
  twilio: {
    accountSid: process.env.ACCOUNT_SID,
    authToken: process.env.AUTH_TOKEN,
    serverDomain: process.env.SERVER_DOMAIN,
  },
  elevenlabs: {
    apiKey: process.env.ELEVENLABS_API_KEY,
  },
  openai: {
    apiKey: process.env.OPENAI_API_KEY,
  },
  deepgram: {
    apiKey: process.env.DEEPGRAM_API_KEY,
  },
  logging: {
    level: process.env.LOG_LEVEL || "info",
    lokiUrl: process.env.LOKI_URL || "http://localhost:3100",
  },
};

logger.info(`🚀 Environnement chargé : ${ENVIRONMENT.toUpperCase()}`);
