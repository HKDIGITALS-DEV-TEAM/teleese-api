import CallSession from "../interfaces/callSession";


async function handleIncomingMedia(session: CallSession, payload: string) {
  try {
    const audioBuffer = Buffer.from(payload, "base64");
    session.dgConnection?.send(audioBuffer);
    session.lastActivity = Date.now();
  } catch (error) {
    console.error(`Session ${session.id}: Erreur de traitement audio:`, error);
  }
}

export default handleIncomingMedia