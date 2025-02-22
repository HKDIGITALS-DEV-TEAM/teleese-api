import { ICall } from "../schema/interfaces/ICall";

/**
 * Interface définissant les méthodes DAO pour la gestion des utilisateurs.
 */
export interface ICallDAO {
  create(user: Partial<ICall>): Promise<ICall>;
  getCall(sessionId: string): Promise<ICall | null>;
  updateTranscript(
    sessionId: string,
    transcript: string
  ): Promise<ICall | null>;
}
