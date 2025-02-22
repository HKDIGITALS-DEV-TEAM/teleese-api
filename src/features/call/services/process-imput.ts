import CONFIG from "../config";
import CallSession from "../interfaces/callSession";
import { ElevenLabsClient } from "elevenlabs";
import streamAudioToClient from "./stream-audio-to-client";
import { makeResponse } from "./response-maker";
import sendAudioToClient from "./send-audio-to-client";

const elevenlabs = new ElevenLabsClient()
async function processUserInput(
  session: CallSession,
  transcript: string,
  phone: string
) {
  try {
    const response = await makeResponse(transcript, phone);

    // Conversion en audio
    const audioStream = await elevenlabs.textToSpeech.convert(
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


export default processUserInput