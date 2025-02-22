/**
 * Interface représentant les paramètres de voix d'une entreprise.
 */
export default interface IVoiceSettings {
    voice_url?: string;
    voice_type?: "synthesized" | "natural";
  }
  