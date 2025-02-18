import Keycloak from "keycloak-connect";
import session from "express-session";
import dotenv from "dotenv";

dotenv.config();

const memoryStore = new session.MemoryStore();

// Définir explicitement la configuration Keycloak
const keycloakConfig: any = {
  clientId: `${process.env.KEYCLOAK_CLIENT_ID}`,
  bearerOnly: true,
  serverUrl: `${process.env.KEYCLOAK_SERVER_URL}`,
  realm: `${process.env.KEYCLOAK_REALM}`,
  credentials: {
    secret: `${process.env.KEYCLOAK_CLIENT_SECRET}`,
  },
};

const keycloak = new Keycloak({ store: memoryStore }, keycloakConfig);

export { keycloak, memoryStore };
