import mongoose from "mongoose";

const voiceSettingsSchema = new mongoose.Schema({
    voice_url: {
      type: String,
      required: true
    },
    voice_type: {
      type: String,
      enum: ['synthesized', 'natural'],
      required: true
    }
});

const VoiceSettings = mongoose.model('VoiceSettings', voiceSettingsSchema);

export { VoiceSettings, voiceSettingsSchema };