/**
 * Interface DTO pour représenter une entreprise.
 */
export interface ICompanyDTO {
    id: string;
    owner_id: string;
    name: string;
    description: string;
    category: string;
    phone_number: string;
    twilio_phone_number: string;
    secondary_phone_number: string;
    specific_configurations: string;
    option: string;
    createdAt: Date;
    updatedAt: Date;
  }
  