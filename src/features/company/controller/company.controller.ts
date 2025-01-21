import { Request, Response, Router } from "express";
import CompanyProvider from "../providers/companyProvider";
import ICompany from "../entity/interfaces/ICompany";
import registerNewPhoneNumber from "@domain/services/phone-number-creator";

const companyRouter = Router();

companyRouter.post("/new", async (req: Request, res: Response) => {
  const companyData: ICompany = req.body;

  const companyProvider = new CompanyProvider();
  await registerNewPhoneNumber(companyData.configurations.primary_phone);
  await companyProvider
    .addCompany(companyData)
    .then(() => {
      res.status(201).json({ message: "company added successfully" });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ message: "Error adding company" });
    });
});

export default companyRouter;
