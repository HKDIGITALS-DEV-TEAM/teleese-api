import { CallDAO } from "@features/call/data/dao/call-dao-impl";
import { ICallDTO } from "@features/call/presentation/dto/call-dto";
import { toCallDTO } from "@features/call/presentation/dto/call-mapper";
import { ICallService } from "./call-service";

/**
 * Service pour la gestion des appels vocaux.
 */
export class CallService implements ICallService {
  private callDAO: CallDAO;

  constructor() {
    this.callDAO = new CallDAO();
  }

  /**
   * Crée un nouvel appel.
   * @param sessionId - ID de session.
   * @param phoneNumber - Numéro de téléphone.
   * @returns Le DTO de l'appel créé.
   */
  async createCall(sessionId: string, phoneNumber: string): Promise<ICallDTO> {
    const call = await this.callDAO.create({
      sessionId,
      phoneNumber,
      status: "active",
    });
    return toCallDTO(call);
  }

  /**
   * Récupère un appel par session ID.
   * @param sessionId - ID de session.
   * @returns Le DTO de l'appel trouvé.
   */
  async getCallBySessionId(sessionId: string): Promise<ICallDTO | null> {
    const call = await this.callDAO.getCallBySessionId(sessionId);
    return call ? toCallDTO(call) : null;
  }

  /**
   * Met à jour la transcription d'un appel.
   * @param sessionId - ID de session.
   * @param transcript - Nouveau texte.
   * @returns Le DTO de l'appel mis à jour.
   */
  async updateCallTranscript(
    sessionId: string,
    transcript: string
  ): Promise<ICallDTO | null> {
    const call = await this.callDAO.updateTranscript(sessionId, transcript);
    return call ? toCallDTO(call) : null;
  }
}
