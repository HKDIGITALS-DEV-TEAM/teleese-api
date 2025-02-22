import { ICompany } from "../../data/schema/interfaces/ICompany";
import { CompanyRequest } from "../request/company-request";
import { ICompanyDTO } from "./company-dto";

/**
 * Convertit une entité entreprise en DTO.
 * @param company - L'entité entreprise.
 * @returns Un objet DTO.
 */
export function toCompanyDTO(company: ICompany): ICompanyDTO {
  return {
    id: company._id?.toString() || "",
    owner_id: company.owner_id,
    name: company.name,
    description: company.description,
    category: company.category,
    phone_number: company.numbers.phone_number,
    twilio_phone_number: company.numbers.twilio_phone_number,
    secondary_phone_number: company.numbers.secondary_phone_number,
    specific_configurations:
      company.configurations?.specific_configurations || "",
    option: company.option,
    createdAt: company.createdAt,
    updatedAt: company.updatedAt,
  };
}

/**
 * Convertit un `CompanyRequest` en entité `ICompany`.
 * @param request - Objet `CompanyRequest` reçu.
 * @param existingCompany - (Optionnel) Entreprise existante en base pour conserver les valeurs non modifiées.
 * @returns Une entité `ICompany`.
 */
export function toCompanyEntity(
  request: Partial<CompanyRequest>,
  existingCompany?: ICompany
): ICompany {
  return {
    _id: existingCompany?._id || undefined,
    owner_id: request.owner_id ?? existingCompany?.owner_id ?? "",
    name: request.name ?? existingCompany?.name ?? "",
    description: request.description ?? existingCompany?.description ?? "",
    category: request.category ?? existingCompany?.category ?? "",
    numbers: {
      phone_number:
        request.numbers?.phone_number ??
        existingCompany?.numbers.phone_number ??
        "",
      twilio_phone_number:
        request.numbers?.twilio_phone_number ??
        existingCompany?.numbers.twilio_phone_number ??
        "",
      secondary_phone_number:
        request.numbers?.secondary_phone_number ??
        existingCompany?.numbers.secondary_phone_number ??
        "",
    },
    configurations: {
      specific_configurations:
        request.configurations?.specific_configurations ??
        existingCompany?.configurations?.specific_configurations ??
        "",
      voice_settings:
        request.configurations?.voice_settings ??
        existingCompany?.configurations?.voice_settings,
    },
    option: request.option ?? existingCompany?.option ?? "",
    createdAt: existingCompany?.createdAt ?? new Date(),
    updatedAt: new Date(),
  } as ICompany;
}
