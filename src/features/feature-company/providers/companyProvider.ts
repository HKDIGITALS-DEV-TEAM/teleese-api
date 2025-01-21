import Company from "../entity/companySchema"
import ICompany from "../entity/interfaces/ICompany";

class CompanyProvider {

    public async addCompany(company: ICompany) {

        return await Company.create({
            owner_id: company.owner_id,
            name: company.name,
            description: company.description,
            category: company.category,
            users: company.users,
            configurations: company.configurations,
            option: company.option,
         });

    }

    /**
     * Récupère une compagnie et ses informations associées par primary_phone.
     * @param {String} phoneNumber - Le numéro de téléphone principal.
     * @returns {Promise<Object>} - Les détails complets de la compagnie, ou null si non trouvé.
     */
    public async getCompanyUsingPhone(phoneNumber: string) {
        try {
            // Recherche dans la base de données
            const company = await Company.findOne({
              'configurations.primary_phone': phoneNumber,
            })
              .populate('owner_id') // Peupler le champ owner_id (si référencé par ObjectId)
              .populate('users') // Peupler les utilisateurs (si référencés par ObjectId)
              .exec();

            if (!company) {
              throw new Error('Company not found with the provided primary_phone.');
            }

            return company;
        } catch (error: any) {
            console.error('Error fetching company:', error.message);
            throw error;
        }
    }

}

export default CompanyProvider