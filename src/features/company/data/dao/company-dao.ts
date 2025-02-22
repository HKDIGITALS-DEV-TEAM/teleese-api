import { ICompany } from "../schema/interfaces/ICompany";

/**
 * Interface définissant les opérations disponibles pour la gestion des entreprises.
 */
export interface ICompanyDAO {
  createCompany(company: ICompany): Promise<ICompany>;
  getCompanyById(id: string): Promise<ICompany | null>;
  updateCompany(
    id: string,
    update: Partial<ICompany>
  ): Promise<ICompany | null>;
  getCompanyByPhone(phoneNumber: string): Promise<ICompany | null>;
  deleteCompany(id: string): Promise<boolean>;
}
