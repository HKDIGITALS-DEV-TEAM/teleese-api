import { Router, Request, Response } from "express";
import { WebSocket } from "ws";
import {
  createCallSession,
  initializeDeepgram,
  handleIncomingMedia,
  startSessionTimeout,
  cleanupSession,
  CallSession,
} from "../../utils/websocket-util";
import { CallService } from "../services/call-service-impl";
import { GlobalException } from "@core/exceptions/global-exception";
import logger from "@infrastructure/logger/logger";

const callRouter = Router();
const callService = new CallService();

/**
 * @swagger
 * tags:
 *   name: Call
 *   description: Gestion des appels vocaux
 */

/**
 * @swagger
 * /call/start:
 *   post:
 *     summary: Démarrer un appel vocal
 *     tags: [Call]
 *     requestBody:
 *       description: Informations nécessaires pour démarrer un appel
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               sessionId:
 *                 type: string
 *                 example: "1234-5678"
 *               phoneNumber:
 *                 type: string
 *                 example: "+33123456789"
 *     responses:
 *       201:
 *         description: Appel démarré avec succès
 *       400:
 *         description: Erreur de validation ou autre
 */
callRouter.post("/start", async (req: Request, res: Response) => {
  try {
    const { sessionId, phoneNumber } = req.body;
    const callDTO = await callService.createCall(sessionId, phoneNumber);
    res.status(201).json(callDTO);
  } catch (error) {
    const formattedError = new GlobalException(
      "Erreur lors de la création de l'appel",
      400,
      "CALL_CREATION_ERROR"
    );
    res.status(formattedError.statusCode).json(formattedError);
  }
});

/**
 * @swagger
 * /call/{sessionId}:
 *   get:
 *     summary: Récupérer les détails d'un appel
 *     tags: [Call]
 *     parameters:
 *       - in: path
 *         name: sessionId
 *         required: true
 *         schema:
 *           type: string
 *         description: L'ID de session de l'appel
 *     responses:
 *       200:
 *         description: Détails de l'appel
 *       404:
 *         description: Appel non trouvé
 */
callRouter.get("/:sessionId", async (req: Request, res: Response) => {
  try {
    const callDTO = await callService.getCallBySessionId(req.params.sessionId);
    if (!callDTO) {
      throw new GlobalException("Appel introuvable", 404, "CALL_NOT_FOUND");
    }
    res.status(200).json(callDTO);
  } catch (error) {
    const formattedError = new GlobalException(
      "Erreur lors de la récupération de l'appel",
      400,
      "CALL_RETRIEVAL_ERROR"
    );
    res.status(formattedError.statusCode).json(formattedError);
  }
});

/**
 * @swagger
 * /call/websocket/{phone}:
 *   get:
 *     summary: Gérer la communication WebSocket pour les appels vocaux
 *     tags: [Call]
 *     parameters:
 *       - in: path
 *         name: phone
 *         required: true
 *         schema:
 *           type: string
 *         description: Le numéro de téléphone associé à l'appel
 *     responses:
 *       101:
 *         description: Connexion WebSocket établie
 *       400:
 *         description: Erreur lors de la connexion WebSocket
 */
callRouter.ws("/websocket/:phone", (ws: WebSocket, req: Request) => {
  let session: CallSession | null = null;

  const phone = req.params.phone;
  logger.info(`📞 Connexion WebSocket établie pour le numéro : ${phone}`);

  ws.on("message", async (data: string) => {
    try {
      const message = JSON.parse(data);

      switch (message.event) {
        case "start":
          session = createCallSession(
            message.start.streamSid,
            message.start.callSid,
            ws
          );
          initializeDeepgram(session, phone);
          startSessionTimeout(session);
          break;

        case "media":
          if (session && !session.isProcessing) {
            await handleIncomingMedia(session, message.media.payload);
          }
          break;

        case "stop":
          if (session) {
            cleanupSession(session.id);
            session = null;
          }
          break;

        default:
          logger.warn(`🚨 Événement WebSocket inconnu : ${message.event}`);
          break;
      }
    } catch (error) {
      logger.error(`❌ Erreur de traitement WebSocket : ${error}`);
      if (session) cleanupSession(session.id);
    }
  });

  ws.on("close", () => {
    if (session) {
      cleanupSession(session.id);
      session = null;
    }
    logger.info(`🔌 Connexion WebSocket fermée pour le numéro : ${phone}`);
  });

  ws.on("error", (error) => {
    logger.error(`⚠️ Erreur WebSocket : ${error}`);
    if (session) {
      cleanupSession(session.id);
      session = null;
    }
  });
});

export default callRouter;
