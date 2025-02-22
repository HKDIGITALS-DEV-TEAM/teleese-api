import { ICallDTO } from "@features/call/presentation/dto/call-dto";

export interface ICallService {
  createCall(sessionId: string, phoneNumber: string): Promise<ICallDTO>;
  getCallBySessionId(sessionId: string): Promise<ICallDTO | null>;
  updateCallTranscript(
    sessionId: string,
    transcript: string
  ): Promise<ICallDTO | null>;
}
