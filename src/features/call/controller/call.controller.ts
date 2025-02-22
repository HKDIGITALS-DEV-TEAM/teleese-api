import { Request, Response } from "express";
import VoiceResponse from "twilio/lib/twiml/VoiceResponse";
import { WebSocket } from "ws";
import { Readable } from "stream";
import OpenAI from "openai";
import { v4 as uuidv4 } from "uuid";
import "dotenv/config";
import CallSession from "../interfaces/callSession";
import handleIncomingMedia from "../services/handle-incoming-media";
import initializeDeepgram from "../services/init-deepgram";
import CONFIG from "../config";
import cleanupSession from "../services/cleanup-session";

// Initialisation des clients avec vérification des clés API
if (!process.env.DEEPGRAM_API_KEY || !process.env.OPENAI_API_KEY) {
  throw new Error("Les clés API requises ne sont pas définies");
}
const activeSessions = new Map<string, CallSession>();

// Gestionnaire des appels entrants
export function handleIncomingCall(req: Request, res: Response) {
  const twiml = new VoiceResponse();
  const toPhone = req.body.To;

  console.log("from phone : " + toPhone);
  console.log(typeof parseInt(toPhone));
  twiml.say(
    {
      language: "fr-FR",
    },
    "Bonjour, je suis votre assistant vocal. Comment puis-je vous aider ?"
  );
  const wsURL = `wss://${process.env.SERVER_DOMAIN}/api/v1/call/connection`;

  try {
    console.log(wsURL);
    twiml
      .connect()
      .stream({
        url: wsURL,
      })
      .parameter({
        name: "calledNumber",
        value: toPhone,
      });
  } catch (error) {
    console.log("erreur lors de la connexion au stream  : ", error);
    throw error;
  }
  console.log(twiml.toString());
  res.type("text/xml").send(twiml.toString());
}

export function handleWebSocket(ws: WebSocket) {
  let session: CallSession | null = null;
  let phone: string;

  // return;
  ws.on("message", async (data: string) => {
    try {
      const message = JSON.parse(data);
      switch (message.event) {
        case "start":
          console.log("Message reçu : " + message.toString());
          phone = message.start.customParameters.calledNumber;
          session = createSession(
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
            cleanupSession(session.id, activeSessions);
            session = null;
          }
          break;
      }
    } catch (error) {
      console.error("Erreur WebSocket:", error);
    }
  });

  ws.on("close", () => {
    if (session) {
      cleanupSession(session.id, activeSessions);
      session = null;
    }
  });

  ws.on("error", (error) => {
    console.error("Erreur WebSocket:", error);
    if (session) {
      cleanupSession(session.id, activeSessions);
      session = null;
    }
  });
}

function createSession(
  streamSid: string,
  callSid: string,
  ws: WebSocket
): CallSession {
  const session: CallSession = {
    id: uuidv4(),
    streamSid,
    callSid,
    ws,
    dgConnection: null,
    lastActivity: Date.now(),
    isProcessing: false,
  };

  activeSessions.set(session.id, session);
  return session;
}

function startSessionTimeout(session: CallSession) {
  const checkInterval = setInterval(() => {
    const inactiveTime = Date.now() - session.lastActivity;
    if (inactiveTime > CONFIG.CONVERSATION_TIMEOUT) {
      console.log(`Session ${session.id}: Timeout d'inactivité`);
      cleanupSession(session.id, activeSessions);
      clearInterval(checkInterval);
    }
  }, 60000);
}
