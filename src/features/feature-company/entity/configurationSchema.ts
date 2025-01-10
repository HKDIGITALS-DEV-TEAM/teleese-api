import mongoose from "mongoose";
import { voiceSettingsSchema } from "./voiceSettingsSchema";


const configurationSchema = new mongoose.Schema({
    primary_phone: {
      type: String,
      required: true
    },
    emergency_phone: {
      type: String,
      required: true
    },
    voice_settings: {
      type: voiceSettingsSchema,
      required: true
    },
    specfic_configurations: {
      type: String,
      required: true
    }
});

const Configuration = mongoose.model('Configuration', configurationSchema);

export { Configuration, configurationSchema };