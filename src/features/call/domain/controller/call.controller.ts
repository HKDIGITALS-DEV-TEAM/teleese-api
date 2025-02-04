import { Request, Response } from "express";
import VoiceResponse from "twilio/lib/twiml/VoiceResponse";
import { ElevenLabsClient } from "elevenlabs";
import { createClient, LiveTranscriptionEvents } from "@deepgram/sdk";
import { WebSocket } from "ws";
import { Readable } from "stream";
import OpenAI from "openai";
import { v4 as uuidv4 } from "uuid";
import { makeResponse } from "../services/response-maker";
import "dotenv/config";

// Types pour une meilleure typage
interface CallSession {
  id: string;
  dgConnection: any;
  ws: WebSocket;
  streamSid: string;
  callSid: string;
  lastActivity: number;
  isProcessing: boolean;
}
const CONFIG = {
  VOICE_ID: "21m00Tcm4TlvDq8ikWAM",
  OUTPUT_FORMAT: "ulaw_8000",
  PROCESSING_TONE: Buffer.from("\u0026\u0000\u0080\u0000").toString("base64"),
  CONVERSATION_TIMEOUT: 300000,
} as const;

// Initialisation des clients avec vérification des clés API
if (!process.env.DEEPGRAM_API_KEY || !process.env.OPENAI_API_KEY) {
  throw new Error("Les clés API requises ne sont pas définies");
}

const clients = {
  elevenlabs: new ElevenLabsClient(),
  deepgram: createClient(process.env.DEEPGRAM_API_KEY),
  openai: new OpenAI({ apiKey: process.env.OPENAI_API_KEY }),
};

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
  const wsURL = `ws://${
    process.env.SERVER_DOMAIN
  }/api/v1/call/connection/${toPhone}`;

  try {
    console.log(wsURL);
    twiml.connect().stream({
      url: wsURL,
      track: "both_tracks",
    });
  } catch (error) {
    console.log("erreur lors de la connexion au stream  : ", error);
    throw error;
  }

  res.type("text/xml").send(twiml.toString());
}

export function handleWebSocket(ws: WebSocket, req: Request) {
  let session: CallSession | null = null;

  console.log(req.params);
  const phone = req.params.phone;

  console.log("numéro récupéré dans la fonction handleWebSocket : " + phone);

  // return;
  ws.on("message", async (data: string) => {
    try {
      const message = JSON.parse(data);

      switch (message.event) {
        case "start":
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
            cleanupSession(session.id);
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
      cleanupSession(session.id);
      session = null;
    }
  });

  ws.on("error", (error) => {
    console.error("Erreur WebSocket:", error);
    if (session) {
      cleanupSession(session.id);
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

function initializeDeepgram(session: CallSession, phone: string) {
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
    console.log(`Session ${session.id}: Connexion Deepgram établie`);
    sendAudioToClient(session, CONFIG.PROCESSING_TONE);
  });

  session.dgConnection.addListener(
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

  session.dgConnection.addListener(
    LiveTranscriptionEvents.Error,
    (error: any) => {
      console.error(`Session ${session.id}: Erreur Deepgram:`, error);
      cleanupSession(session.id);
    }
  );
}

async function handleIncomingMedia(session: CallSession, payload: string) {
  try {
    const audioBuffer = Buffer.from(payload, "base64");
    session.dgConnection?.send(audioBuffer);
    session.lastActivity = Date.now();
  } catch (error) {
    console.error(`Session ${session.id}: Erreur de traitement audio:`, error);
  }
}

async function processUserInput(
  session: CallSession,
  transcript: string,
  phone: string
) {
  try {
    const response = await makeResponse(transcript, phone);

    // Conversion en audio
    const audioStream = await clients.elevenlabs.textToSpeech.convert(
      CONFIG.VOICE_ID,
      {
        text: "ceci est la réponse fixe du service",
        model_id: "eleven_flash_v2_5",
        output_format: CONFIG.OUTPUT_FORMAT,
      }
    );

    // Envoi de l'audio
    await streamAudioToClient(session, audioStream);
  } catch (error) {
    console.error(`Session ${session.id}: Erreur de traitement:`, error);
    sendAudioToClient(session, CONFIG.PROCESSING_TONE); // Ton d'erreur
  } finally {
    session.isProcessing = false;
  }
}

async function streamAudioToClient(session: CallSession, stream: Readable) {
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
        resolve(true);
      }
    });
  });
}

function sendAudioToClient(session: CallSession, audioPayload: string) {
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

function startSessionTimeout(session: CallSession) {
  const checkInterval = setInterval(() => {
    const inactiveTime = Date.now() - session.lastActivity;
    if (inactiveTime > CONFIG.CONVERSATION_TIMEOUT) {
      console.log(`Session ${session.id}: Timeout d'inactivité`);
      cleanupSession(session.id);
      clearInterval(checkInterval);
    }
  }, 60000);
}

function cleanupSession(sessionId: string) {
  const session = activeSessions.get(sessionId);
  if (session) {
    console.log(`Nettoyage de la session ${sessionId}`);
    session.dgConnection?.finish();
    if (session.ws.readyState === WebSocket.OPEN) {
      session.ws.close();
    }
    activeSessions.delete(sessionId);
  }
}
