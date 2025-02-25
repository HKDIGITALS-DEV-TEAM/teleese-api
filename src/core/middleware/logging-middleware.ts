import { Request, Response, NextFunction } from "express";
import logger from "@infrastructure/logger/logger";

/**
 * Middleware pour enregistrer les requêtes HTTP et capturer les erreurs.
 * @param {Request} req - Requête entrante.
 * @param {Response} res - Réponse sortante.
 * @param {NextFunction} next - Fonction suivante dans la chaîne.
 */
export const loggingMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { method, url, body, params, query } = req;
  logger.info(
    `📡 [${method}] ${url} - Body: ${JSON.stringify(
      body
    )} | Params: ${JSON.stringify(params)} | Query: ${JSON.stringify(query)}`
  );

  res.on("finish", () => {
    logger.info(`✅ Réponse envoyée - Status: ${res.statusCode}`);
  });

  res.on("error", (err) => {
    logger.error(`❌ Erreur dans la réponse: ${err.message}`);
  });

  next();
};
