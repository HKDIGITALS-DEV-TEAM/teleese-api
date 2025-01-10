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

export default companyRouter;