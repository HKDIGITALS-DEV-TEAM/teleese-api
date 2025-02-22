import CallSession from "../interfaces/callSession";

function sendAudioToClient(session: CallSession, audioPayload: string) {
  if (session.ws.OPEN) {
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


export default sendAudioToClient