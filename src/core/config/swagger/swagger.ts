import swaggerJsDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { Application } from "express";
import { swaggerSchemas } from "./schemas";

// Configuration Swagger
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API Teleese",
      version: "1.0.0",
      description:
        "Documentation de l'API de l'application Teleese.",
    },
    servers: [
      {
        url: `${process.env.API_HOSTNAME || "http://localhost:3000"}/${
          process.env.API_PREFIX || "api/v1"
        }`,
        description: "Serveur principal",
      },
    ],
    components: {
      schemas: swaggerSchemas,
    },
  },
  apis: ["./src/features/**/*.ts"], // Inclut tous les fichiers où les commentaires Swagger sont présents.
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

/**
 * Initialise et configure Swagger pour l'application.
 *
 * @param {Application} app - L'application Express.
 */
export const setupSwagger = (app: Application) => {
  app.use(
    `/${process.env.API_PREFIX || "api/v1"}/docs`,
    swaggerUi.serve,
    swaggerUi.setup(swaggerDocs)
  );
};
