import IVoiceSettings from "./IVoiceSettings";

interface IConfiguration {
    primary_phone: string,
    emergency_phone: string,
    voice_settings: IVoiceSettings,
    specfic_configurations: string
}

export default IConfiguration;
