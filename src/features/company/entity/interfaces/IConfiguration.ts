import IVoiceSettings from "./IVoiceSettings";

interface IConfiguration {
    voice_settings?: IVoiceSettings,
    specfic_configurations: string
}

export default IConfiguration;
