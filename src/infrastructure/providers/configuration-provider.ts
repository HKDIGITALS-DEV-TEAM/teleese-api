import { ValidationException } from "@core/exceptions/validation-exception";
import { Configuration } from "@features/company/data/schema/configuration-schema";
import IConfiguration from "@features/company/data/schema/interfaces/IConfiguration";

/**
 * Provider pour la gestion des configurations des entreprises.
 */
export class ConfigurationProvider {
  /**
   * Ajoute une nouvelle configuration.
   * @param configuration - Données de la configuration à ajouter.
   * @returns La configuration créée.
   * @throws ValidationException si les données sont invalides.
   */
  public async addConfiguration(configuration: IConfiguration) {
    if (!configuration || !configuration.specific_configurations) {
      throw new ValidationException(
        "Les données de configuration sont invalides."
      );
    }

    const newConfiguration = await Configuration.create(configuration);
    return newConfiguration;
  }
}
