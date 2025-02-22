import { Readable } from "stream";
import CallSession from "../interfaces/callSession";

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


export default streamAudioToClient