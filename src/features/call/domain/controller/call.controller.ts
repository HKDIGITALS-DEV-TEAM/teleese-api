import { Router, Request, Response } from "express";
import VoiceResponse from "twilio/lib/twiml/VoiceResponse";
import { ElevenLabsClient } from "elevenlabs";
import { WebSocket } from "ws";
import { Readable } from "stream";

const elevenlabs = new ElevenLabsClient();
const voiceId = "21m00Tcm4TlvDq8ikWAM";
const outputFormat = "ulaw_8000";

/**
 * @function incomingCallController
 * @abstract handle incoming calls from clients
 * @param req
 * @param res
 */
export function incomingCallController(req: Request, res: Response) {
  const calledNumber: number = req.body.To;

  /**
   * bon ça c'est la partie dans laquelle on recherche le numéro de téléphone
   * contacté dan sla base de donnée et on charge les information de la
   * compagnie associée
   */
  // getRestaurantContext(calledNumber);

  const twiml = new VoiceResponse();
  twiml.say(
    "Merci d'avoir appelé, nous vous mettons en ligne avec votre assistant"
  );

  twiml.connect().stream({
    url: `wss://${process.env.SERVER_DOMAIN}/call/connection`,
  });
  res.writeHead(200, { "Content-Type": "text/xml" });
  res.end(twiml.toString());
}

/**
 *
 * @param ws
 */
export function webSocketHandler(ws: WebSocket) {
  ws.on("message", async (data: string) => {
    const message: {
      event: string;
      start?: { streamSid: string; callSid: string };
    } = JSON.parse(data);
    if (message.event && message.start) {
      try {
        // const textResponse = await makeRestaurantResponse(message.event);
        const streamSid = message.start.streamSid;
        const response = await elevenlabs.textToSpeech.convert(voiceId, {
          model_id: "eleven_flash_v2_5",
          output_format: outputFormat,
          text: "",
        });
        const readableStream = Readable.from(response);
        const audioArrayBuffer = await streamToArrayBuffer(readableStream);
        ws.send(
          JSON.stringify({
            streamSid,
            event: "media",
            media: {
              payload: Buffer.from(audioArrayBuffer as ArrayBuffer).toString(
                "base64"
              ),
            },
          })
        );
      } catch (error) {
        console.error("Error processing message:", error);
      }
    }
  });
  ws.on("error", console.error);
}

/**
 *
 * @param readableStream
 * @returns
 */
function streamToArrayBuffer(readableStream: Readable): Promise<ArrayBuffer> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    readableStream.on("data", (chunk) => {
      chunks.push(chunk);
    });
    readableStream.on("end", () => {
      resolve(Buffer.concat(chunks).buffer);
    });
    readableStream.on("error", reject);
  });
}
