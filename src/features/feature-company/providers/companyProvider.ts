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

}

export default CompanyProvider