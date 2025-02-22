import mongoose, { Schema } from "mongoose";
import { voiceSettingsSchema } from "./voice-settings-schema";

/**
 * Schéma Mongoose pour les configurations d'une entreprise.
 */
const ConfigurationSchema = new Schema({
  voice_settings: { type: voiceSettingsSchema, required: true },
  specific_configurations: { type: String, required: true },
});

const Configuration = mongoose.model("Configuration", ConfigurationSchema);

export { Configuration, ConfigurationSchema };
