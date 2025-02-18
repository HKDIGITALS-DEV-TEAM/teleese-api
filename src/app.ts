import express from "express";
import session from "express-session";
import cors from "cors";
import { keycloak, memoryStore } from "@core/middleware/keycloak-config";
import connectToDB from "@core/config/db-connection";
import ExpressWs from "express-ws";
import TwilioService from "@core/config/twilio";
import { setupSwagger } from "@core/config/swagger/swagger";
import logger from "@infrastructure/logger/logger";
import { router } from "./routes";

const { app } = ExpressWs(express());

// Configuration CORS
app.use(
  cors({
    origin: (origin, callback) => {
      // Autorise toutes les origines
      callback(null, true);
    },
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: [
      "Origin",
      "X-Requested-With",
      "Content-Type",
      "Accept",
      "Authorization",
    ],
    credentials: true,
  })
);

/**
 * Middleware pour OPTIONS (pré-requêtes CORS)
 *
 * Garantir que les pré-requêtes HTTP OPTIONS sont correctement gérées.
 */
app.options("*", (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH");
  res.sendStatus(200);
});

/**
 * Middleware pour les en-têtes par défaut
 *
 * Garantit que toutes les réponses HTTP incluent les en-têtes nécessaires.
 */
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH");
  next();
});

/**
 * Middleware pour exposer les en-têtes spécifiques
 *
 * Permet d'exposer des en-têtes spécifiques comme Authorization, nécessaires pour les clients frontaux ou mobiles.
 */
app.use((req, res, next) => {
  res.header("Access-Control-Expose-Headers", "Authorization");
  next();
});

// Middleware session
app.use(
  session({
    secret: process.env.SESSION_SECRET || "defaultSecret",
    resave: false,
    saveUninitialized: true,
    store: memoryStore,
  })
);

// Initialiser Keycloak
app.use(keycloak.middleware());

// Middleware JSON
app.use(express.json());

app.use(express.urlencoded({ extended: true }));

// Initialiser Swagger
setupSwagger(app);
// Préfixe des routes
app.use(`/${process.env.API_PREFIX || "api/v1"}`, router);

//app.ws("/api/v1/call/connection/:phone", handleWebSocket);

TwilioService.getInstance().validateConnection();

(async () => {
  try {
    await connectToDB();
    logger.info("Base de données initialisée avec succès.");
  } catch (error) {
    logger.error(
      "Erreur lors de l'initialisation de la base de données :",
      error
    );
    process.exit(1); // Arrêter l'application si la base de données ne peut pas être initialisée
  }
})();

export { app };
