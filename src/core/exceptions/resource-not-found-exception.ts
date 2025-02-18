import { GlobalException } from "./global-exception";

/**
 * Exception levée lorsqu'une ressource demandée est introuvable.
 */
export class ResourceNotFoundException extends GlobalException {
  /**
   * Constructeur de l'exception ResourceNotFoundException.
   * @param {string} resource - Nom de la ressource concernée.
   * @param {any} identifier - Identifiant de la ressource recherchée.
   */
  constructor(resource: string, identifier?: any) {
    super(
      `${resource} non trouvé${
        identifier ? ` avec l'identifiant ${identifier}` : ""
      }.`,
      404,
      "RESOURCE_NOT_FOUND",
      { resource, identifier }
    );
  }
}
