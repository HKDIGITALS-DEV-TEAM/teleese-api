import { ValidationException } from "@core/exceptions/validation-exception";
import IVoiceSettings from "@features/company/data/schema/interfaces/IVoiceSettings";
import { VoiceSettings } from "@features/company/data/schema/voice-settings-schema";

/**
 * Provider pour la gestion des paramètres vocaux des entreprises.
 */
export class VoiceProvider {
  /**
   * Ajoute de nouveaux paramètres vocaux.
   * @param voiceSettings - Données des paramètres vocaux.
   * @returns Les paramètres vocaux créés.
   * @throws ValidationException si les données sont invalides.
   */
  public async addVoiceSettings(voiceSettings: IVoiceSettings) {
    if (!voiceSettings || !voiceSettings.voice_type) {
      throw new ValidationException("Les paramètres vocaux sont invalides.");
    }

    const newVoiceSettings = await VoiceSettings.create(voiceSettings);
    return newVoiceSettings;
  }
}
