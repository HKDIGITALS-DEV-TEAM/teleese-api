import CallSession from "../interfaces/callSession";

function cleanupSession(sessionId: string, activeSessions : Map<string, CallSession>) {
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

export default cleanupSession