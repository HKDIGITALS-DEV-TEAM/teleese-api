import { WebSocket } from "ws";
import { Readable } from "stream";
import { v4 as uuidv4 } from "uuid";
import { makeResponse } from "./response-util";
import { ElevenLabsClient } from "elevenlabs";
import { createClient, LiveTranscriptionEvents } from "@deepgram/sdk";
import logger from "@infrastructure/logger/logger";

/**
 * Interface représentant une session d'appel WebSocket.
 */
export interface CallSession {
  id: string;
  dgConnection: any;
  ws: WebSocket;
  streamSid: string;
  callSid: string;
  lastActivity: number;
  isProcessing: boolean;
}

/**
 * Configuration globale pour le traitement des appels.
 */
const CONFIG = {
  VOICE_ID: "21m00Tcm4TlvDq8ikWAM",
  OUTPUT_FORMAT: "ulaw_8000",
  PROCESSING_TONE: Buffer.from("\u0026\u0000\u0080\u0000").toString("base64"),
  CONVERSATION_TIMEOUT: 300000,
} as const;

// Clients externes
const clients = {
  elevenlabs: new ElevenLabsClient(),
  deepgram: createClient(process.env.DEEPGRAM_API_KEY),
};

/**
 * Map pour suivre les sessions actives.
 */
const activeSessions = new Map<string, CallSession>();

/**
 * Crée une nouvelle session d'appel WebSocket.
 * @param streamSid - ID du flux.
 * @param callSid - ID de l'appel.
 * @param ws - Instance WebSocket associée.
 * @returns Une nouvelle session d'appel.
 */
export function createCallSession(
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

/**
 * Initialise la connexion avec Deepgram pour la transcription en temps réel.
 * @param session - La session d'appel à configurer.
 * @param phone - Numéro de téléphone associé à l'appel.
 */
export function initializeDeepgram(session: CallSession, phone: string): void {
  session.dgConnection = clients.deepgram.listen.live({
    model: "nova-2",
    language: "fr",
    interim_results: true,
    endpointing: 800,
    encoding: "mulaw",
    sample_rate: 8000,
    vad_events: true,
  });

  session.dgConnection.on(LiveTranscriptionEvents.Open, () => {
    logger.info(`Session ${session.id}: Connexion à Deepgram établie`);
    sendAudioToClient(session, CONFIG.PROCESSING_TONE);
  });

  session.dgConnection.on(
    LiveTranscriptionEvents.Transcript,
    async (data: any) => {
      if (data.is_final && !session.isProcessing) {
        const transcript = data.channel.alternatives[0].transcript.trim();
        if (transcript) {
          session.isProcessing = true;
          await processUserInput(session, transcript, phone);
          session.lastActivity = Date.now();
        }
      }
    }
  );

  session.dgConnection.on(LiveTranscriptionEvents.Error, (error: any) => {
    logger.error(`Session ${session.id}: Erreur Deepgram:`, error);
    cleanupSession(session.id);
  });
}

/**
 * Traite les données audio entrantes.
 * @param session - La session d'appel.
 * @param payload - Données audio encodées en base64.
 */
export async function handleIncomingMedia(
  session: CallSession,
  payload: string
): Promise<void> {
  try {
    const audioBuffer = Buffer.from(payload, "base64");
    session.dgConnection?.send(audioBuffer);
    session.lastActivity = Date.now();
  } catch (error) {
    logger.error(`Session ${session.id}: Erreur de traitement audio:`, error);
  }
}

/**
 * Traite la transcription d'entrée de l'utilisateur et génère une réponse vocale.
 * @param session - La session en cours.
 * @param transcript - Texte transcrit.
 * @param phone - Numéro de téléphone associé.
 */
async function processUserInput(
  session: CallSession,
  transcript: string,
  phone: string
): Promise<void> {
  try {
    const response = await makeResponse(transcript, phone);

    // Conversion texte en audio
    const audioStream = await clients.elevenlabs.textToSpeech.convert(
      CONFIG.VOICE_ID,
      {
        text: response,
        model_id: "eleven_flash_v2_5",
        output_format: CONFIG.OUTPUT_FORMAT,
      }
    );

    // Envoi de la réponse vocale
    await streamAudioToClient(session, audioStream);
  } catch (error) {
    logger.error(`Session ${session.id}: Erreur de traitement:`, error);
    sendAudioToClient(session, CONFIG.PROCESSING_TONE);
  } finally {
    session.isProcessing = false;
  }
}

/**
 * Envoie un flux audio au client.
 * @param session - La session d'appel en cours.
 * @param stream - Flux audio à transmettre.
 */
export async function streamAudioToClient(
  session: CallSession,
  stream: Readable
): Promise<void> {
  return new Promise((resolve) => {
    let chunkIndex = 0;

    stream.on("data", (chunk) => {
      if (session.ws.readyState === WebSocket.OPEN) {
        const message = {
          streamSid: session.streamSid,
          event: "media",
          media: {
            payload: Buffer.from(chunk).toString("base64"),
            track: "outbound",
            chunk: chunkIndex.toString().padStart(3, "0"),
          },
        };

        session.ws.send(JSON.stringify(message));
        chunkIndex++;
      }
    });

    stream.on("end", () => {
      if (session.ws.readyState === WebSocket.OPEN) {
        session.ws.send(
          JSON.stringify({
            streamSid: session.streamSid,
            event: "mark",
            mark: { name: "end_of_response" },
          })
        );
        resolve();
      }
    });
  });
}

/**
 * Envoie un message audio spécifique au client.
 * @param session - La session d'appel.
 * @param audioPayload - Données audio encodées en base64.
 */
export function sendAudioToClient(
  session: CallSession,
  audioPayload: string
): void {
  if (session.ws.readyState === WebSocket.OPEN) {
    session.ws.send(
      JSON.stringify({
        streamSid: session.streamSid,
        event: "media",
        media: {
          payload: audioPayload,
          track: "outbound",
        },
      })
    );
  }
}

/**
 * Lance une minuterie pour surveiller l'inactivité et nettoyer la session si nécessaire.
 * @param session - La session d'appel.
 */
export function startSessionTimeout(session: CallSession): void {
  const checkInterval = setInterval(() => {
    const inactiveTime = Date.now() - session.lastActivity;
    if (inactiveTime > CONFIG.CONVERSATION_TIMEOUT) {
      logger.info(`Session ${session.id}: Timeout d'inactivité`);
      cleanupSession(session.id);
      clearInterval(checkInterval);
    }
  }, 60000);
}

/**
 * Nettoie et termine une session d'appel.
 * @param sessionId - Identifiant de la session à nettoyer.
 */
export function cleanupSession(sessionId: string): void {
  const session = activeSessions.get(sessionId);
  if (session) {
    logger.info(`Nettoyage de la session ${sessionId}`);
    session.dgConnection?.finish();
    if (session.ws.readyState === WebSocket.OPEN) {
      session.ws.close();
    }
    activeSessions.delete(sessionId);
  }
}
