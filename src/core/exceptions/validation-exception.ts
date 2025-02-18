import { GlobalException } from "./global-exception";

/**
 * Exception levée en cas d'erreur de validation.
 */
export class ValidationException extends GlobalException {
  /**
   * Constructeur de l'exception ValidationException.
   * @param {string} message - Message d'erreur.
   * @param {any} details - Détails des erreurs de validation.
   */
  constructor(message: string, details?: any) {
    super(message, 400, "VALIDATION_ERROR", details);
  }
}
