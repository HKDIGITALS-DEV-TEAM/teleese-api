import { Request, Response, Router } from "express";
import CompanyProvider from "../providers/companyProvider";
import ICompany from "../entity/interfaces/ICompany";

const companyRouter = Router();

companyRouter.post("/new", async (req: Request, res: Response) => {

    const { owner_id, name, description, category, users, configurations, option } = req.body;

    let companyData: ICompany = {
        owner_id,
        name,
        description,
        category,
        users,
        configurations,
        option,
    }

    const companyProvider = new CompanyProvider();
    await companyProvider.addCompany(companyData).then(() => {
        res.status(201).json({message: "company added successfully"});
    }).catch((err) => {
        console.log(err);
        res.status(500).json({message: "Error adding company"});
    });

})

companyRouter.get("/getCompanyByPhone/:phone_number", async (req: Request, res: Response) => {

    const companyProvider = new CompanyProvider();
    await companyProvider.getCompanyUsingPhone(req.params.phone_number).then((company) => {
        res.status(200).json({message: "Company found successfully", company});
    }).catch((err) => {
        console.log(err);
        res.status(500).json({message: "Error fetching company"});
    })
})

export default companyRouter;