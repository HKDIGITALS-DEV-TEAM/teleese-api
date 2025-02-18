import { Call } from "../schema/call-schema";
import { ICall } from "../schema/interfaces/ICall";

/**
 * Repository pour la gestion des appels dans la base de données.
 */
export class CallRepository {
  /**
   * Crée un nouvel appel en base de données.
   * @param call - Données de l'appel à créer.
   * @returns L'appel créé.
   */
  async create(call: Partial<ICall>): Promise<ICall> {
    return await Call.create(call);
  }

  /**
   * Récupère un appel par son identifiant de session.
   * @param sessionId - Identifiant de session.
   * @returns L'appel trouvé ou `null` si inexistant.
   */
  async findBySessionId(sessionId: string): Promise<ICall | null> {
    return await Call.findOne({ sessionId });
  }

  /**
   * Met à jour la transcription d'un appel.
   * @param sessionId - Identifiant de session.
   * @param transcript - Nouveau texte de transcription.
   * @returns L'appel mis à jour ou `null` si inexistant.
   */
  async updateTranscript(
    sessionId: string,
    transcript: string
  ): Promise<ICall | null> {
    return await Call.findOneAndUpdate(
      { sessionId },
      { transcript, status: "completed" },
      { new: true }
    );
  }
}
