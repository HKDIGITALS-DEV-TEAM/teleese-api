import Company from "../entity/companySchema"
import { Configuration } from "../entity/configurationSchema";
import IConfiguration from "../entity/interfaces/IConfiguration";

class ConfigurationProvider {

    public async addConfiguration(configuration: IConfiguration) {

        const newConfiguration = await Configuration.create({
            configuration
        });

        return newConfiguration;
    }

}

export default ConfigurationProvider