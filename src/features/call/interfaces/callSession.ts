import { WebSocket } from "ws";

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

export default CallSession