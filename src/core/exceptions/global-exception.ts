/**
 * Classe de base pour toutes les exceptions de l'application.
 * @extends Error
 */
export class GlobalException extends Error {
  public readonly statusCode: number;
  public readonly errorCode: string;
  public readonly details?: any;

  /**
   * Constructeur de l'exception globale.
   * @param {string} message - Message de l'exception.
   * @param {number} statusCode - Code HTTP de l'exception.
   * @param {string} errorCode - Code d'erreur spécifique.
   * @param {any} details - Détails supplémentaires (facultatif).
   */
  constructor(
    message: string,
    statusCode: number,
    errorCode: string,
    details?: any
  ) {
    super(message);
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.details = details;

    // Maintenir la pile d'erreurs propre
    Error.captureStackTrace(this, this.constructor);
  }

  /**
   * Retourne une représentation JSON de l'exception.
   * @returns {object}
   */
  toJSON() {
    return {
      statusCode: this.statusCode,
      errorCode: this.errorCode,
      message: this.message,
      details: this.details,
    };
  }
}
