import mongoose, { Schema } from "mongoose";

/**
 * Schéma Mongoose pour les paramètres de voix d'une entreprise.
 */
const voiceSettingsSchema = new Schema({
  voice_url: { type: String, required: true },
  voice_type: {
    type: String,
    enum: ["synthesized", "natural"],
    required: true,
  },
});

const VoiceSettings = mongoose.model("VoiceSettings", voiceSettingsSchema);

export { VoiceSettings, voiceSettingsSchema };
