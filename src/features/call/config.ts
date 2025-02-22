import { OutputFormat } from "elevenlabs/api";

const CONFIG = {
  VOICE_ID: "21m00Tcm4TlvDq8ikWAM",
  OUTPUT_FORMAT: "ulaw_8000" as OutputFormat,
  PROCESSING_TONE: Buffer.from("\u0026\u0000\u0080\u0000").toString("base64"),
  CONVERSATION_TIMEOUT: 300000,
} ;

export default CONFIG