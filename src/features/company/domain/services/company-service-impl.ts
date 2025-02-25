import { CompanyDAOImpl } from "@features/company/data/dao/company-dao-impl";
import { ICompany } from "../../data/schema/interfaces/ICompany";
import { ICompanyService } from "./company-service";
import {
  toCompanyDTO,
  toCompanyEntity,
} from "@features/company/presentation/dto/company-mapper";
import { ICompanyDTO } from "@features/company/presentation/dto/company-dto";
import { CompanyRequest } from "@features/company/presentation/request/company-request";
import TwilioService from "@core/config/twilio";
import logger from "@infrastructure/logger/logger";
import { ConfigurationProvider } from "@infrastructure/providers/configuration-provider";
import { VoiceProvider } from "@infrastructure/providers/voice-provider";
/**
 * Service pour la gestion des entreprises.
 */
export class CompanyServiceImpl implements ICompanyService {
  private companyDAO: CompanyDAOImpl;
  private configurationProvider: ConfigurationProvider;
  private voiceProvider: VoiceProvider;
  private twilioService: TwilioService;

  constructor() {
    this.companyDAO = new CompanyDAOImpl();
    this.configurationProvider = new ConfigurationProvider();
    this.voiceProvider = new VoiceProvider();
    this.twilioService = TwilioService.getInstance();
  }

  /**
   * Crée une nouvelle entreprise et enregistre un numéro Twilio.
   * @param request - Données de l'entreprise.
   * @returns L'entreprise créée sous forme de DTO.
   */
  async createCompany(request: CompanyRequest): Promise<ICompanyDTO> {
    const companyEntity: ICompany = toCompanyEntity(request);

    // Création de la configuration associée
    if (companyEntity.configurations) {
      await this.configurationProvider.addConfiguration(
        companyEntity.configurations
      );
    }

    // Création des paramètres vocaux si fournis
    if (companyEntity.configurations?.voice_settings) {
      await this.voiceProvider.addVoiceSettings(
        companyEntity.configurations.voice_settings
      );
    }

    // Création de l'entreprise en base
    const savedCompany = await this.companyDAO.createCompany(companyEntity);

    // Enregistrement du numéro Twilio
    try {
      await this.twilioService.registerPhoneNumber(
        savedCompany.numbers.twilio_phone_number
      );
      logger.info(
        `Numéro Twilio ${savedCompany.numbers.twilio_phone_number} enregistré.`
      );
    } catch (error) {
      logger.error(
        `Erreur lors de l'enregistrement du numéro Twilio : ${error}`
      );
      throw new Error("Erreur lors de l'enregistrement du numéro Twilio.");
    }

    return toCompanyDTO(savedCompany);
  }

  async getCompanyById(id: string): Promise<ICompanyDTO | null> {
    const company = await this.companyDAO.getCompanyById(id);
    return company ? toCompanyDTO(company) : null;
  }

  /**
   * Met à jour une entreprise existante.
   * @param id - ID de l'entreprise.
   * @param request - Données mises à jour.
   * @returns L'entreprise mise à jour sous forme de DTO.
   */
  async updateCompany(
    id: string,
    request: Partial<CompanyRequest>
  ): Promise<ICompanyDTO | null> {
    const updateData: Partial<ICompany> = toCompanyEntity(request);
    const updatedCompany = await this.companyDAO.updateCompany(id, updateData);
    return updatedCompany ? toCompanyDTO(updatedCompany) : null;
  }

  async deleteCompany(id: string): Promise<boolean> {
    return await this.companyDAO.deleteCompany(id);
  }
}
