import { ICompanyDTO } from "@features/company/presentation/dto/company-dto";
import { CompanyRequest } from "@features/company/presentation/request/company-request";

/**
 * Interface définissant les opérations du service Company.
 */
export interface ICompanyService {
  createCompany(request: CompanyRequest): Promise<ICompanyDTO>;
  getCompanyById(id: string): Promise<ICompanyDTO | null>;
  updateCompany(
    id: string,
    request: Partial<CompanyRequest>
  ): Promise<ICompanyDTO | null>;
  deleteCompany(id: string): Promise<boolean>;
}
