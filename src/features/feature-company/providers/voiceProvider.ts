import Company from "../entity/companySchema"
import IVoiceSettings from "../entity/interfaces/IVoiceSettings";
import { VoiceSettings } from "../entity/voiceSettingsSchema";

class VoiceProvider {

    public async addCompany(voiceSettings: IVoiceSettings) {

        const newVoiceSettings = await VoiceSettings.create({
            voiceSettings
        });

        return newVoiceSettings;
    }

}

export default VoiceProvider