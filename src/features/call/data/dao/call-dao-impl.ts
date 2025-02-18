import { ValidationException } from "@core/exceptions/validation-exception";
import { CallRepository } from "../repository/call-repository";
import { ICall } from "../schema/interfaces/ICall";
import { ResourceNotFoundException } from "@core/exceptions/resource-not-found-exception";

/**
 * DAO pour la gestion des appels vocaux.
 */
export class CallDAO {
  private callRepository: CallRepository;

  constructor() {
    this.callRepository = new CallRepository();
  }

  /**
   * Crée un nouvel appel après validation des données.
   * @param call - Données de l'appel à créer.
   * @returns L'appel créé.
   * @throws ValidationException en cas de données invalides.
   */
  async create(call: Partial<ICall>): Promise<ICall> {
    if (!call.sessionId || !call.phoneNumber) {
      throw new ValidationException(
        "Les champs sessionId et phoneNumber sont obligatoires."
      );
    }
    return await this.callRepository.create(call);
  }

  /**
   * Récupère un appel par son identifiant de session.
   * @param sessionId - Identifiant de session de l'appel.
   * @returns L'appel correspondant ou `null` si introuvable.
   * @throws ResourceNotFoundException si aucun appel n'est trouvé.
   */
  async getCallBySessionId(sessionId: string): Promise<ICall> {
    const call = await this.callRepository.findBySessionId(sessionId);
    if (!call) {
      throw new ResourceNotFoundException(
        `Aucun appel trouvé pour la session ${sessionId}.`
      );
    }
    return call;
  }

  /**
   * Met à jour la transcription d'un appel.
   * @param sessionId - Identifiant de session de l'appel.
   * @param transcript - Nouveau texte de transcription.
   * @returns L'appel mis à jour.
   * @throws ResourceNotFoundException si aucun appel n'est trouvé.
   */
  async updateTranscript(
    sessionId: string,
    transcript: string
  ): Promise<ICall> {
    const updatedCall = await this.callRepository.updateTranscript(
      sessionId,
      transcript
    );
    if (!updatedCall) {
      throw new ResourceNotFoundException(
        `Impossible de mettre à jour l'appel pour la session ${sessionId}.`
      );
    }
    return updatedCall;
  }
}
