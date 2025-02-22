import CONFIG from "../config";
import CallSession from "../interfaces/callSession";
import { createClient, LiveTranscriptionEvents } from "@deepgram/sdk";
import sendAudioToClient from "./send-audio-to-client";
import processUserInput from "./process-imput";

const deepgram = createClient(process.env.DEEPGRAM_API_KEY);

function initializeDeepgram(session: CallSession, phone: string) {
  session.dgConnection = deepgram.listen.live({
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
      // cleanupSession(session.id);
    }
  );
}


export default initializeDeepgram