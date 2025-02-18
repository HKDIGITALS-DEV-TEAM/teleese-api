import IVoiceSettings from "./IVoiceSettings";

/**
 * Interface représentant les configurations d'une entreprise.
 */
export default interface IConfiguration {
  voice_settings?: IVoiceSettings;
  specific_configurations: string;
}
