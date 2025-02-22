import { ICompany } from "../schema/interfaces/ICompany";
import Company from "../schema/company-schema";
import { ICompanyDAO } from "./company-dao";
import { ValidationException } from "@core/exceptions/validation-exception";
import { ResourceNotFoundException } from "@core/exceptions/resource-not-found-exception";
import logger from "@infrastructure/logger/logger";

/**
 * Implémentation de l'interface ICompanyDAO.
 */
export class CompanyDAOImpl implements ICompanyDAO {
  async createCompany(company: ICompany): Promise<ICompany> {
    if (!company.owner_id || !company.name) {
      throw new ValidationException(
        "Les champs 'owner_id' et 'name' sont obligatoires."
      );
    }
    return await Company.create(company);
  }

  async getCompanyById(id: string): Promise<ICompany | null> {
    const company = await Company.findById(id);
    if (!company) {
      throw new ResourceNotFoundException(
        `Entreprise avec l'ID ${id} introuvable.`
      );
    }
    return company;
  }

  /**
   * Récupère une entreprise en fonction de son numéro principal.
   * @param phoneNumber - Numéro principal de l'entreprise.
   * @returns Les détails de l'entreprise ou `null` si introuvable.
   * @throws ResourceNotFoundException si aucune entreprise n'est trouvée.
   */
  public async getCompanyByPhone(phoneNumber: string): Promise<ICompany | null> {
    try {
      const company = await Company.findOne({
        "numbers.phone_number": phoneNumber,
      }).populate("owner_id").populate("users").exec();

      if (!company) {
        throw new ResourceNotFoundException(`Aucune entreprise trouvée pour le numéro ${phoneNumber}.`);
      }

      return company;
    } catch (error: any) {
      logger.error("Erreur lors de la récupération de l'entreprise:", error.message);
      throw error;
    }
  }

  async updateCompany(
    id: string,
    update: Partial<ICompany>
  ): Promise<ICompany | null> {
    const updatedCompany = await Company.findByIdAndUpdate(id, update, {
      new: true,
    });
    if (!updatedCompany) {
      throw new ResourceNotFoundException(
        `Impossible de mettre à jour l'entreprise avec l'ID ${id}.`
      );
    }
    return updatedCompany;
  }

  async deleteCompany(id: string): Promise<boolean> {
    const result = await Company.findByIdAndDelete(id);
    if (!result) {
      throw new ResourceNotFoundException(
        `Impossible de supprimer l'entreprise avec l'ID ${id}.`
      );
    }
    return true;
  }
}
