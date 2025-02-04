import { Request, Response, Router } from "express";
import CompanyProvider from "../providers/companyProvider";
import ICompany from "../entity/interfaces/ICompany";
import TwilioService from "@domain/config/twilio";

const companyRouter = Router();

const twilioInstance = TwilioService.getInstance();

companyRouter.post("/new", async (req: Request, res: Response) => {
  const companyData: ICompany = req.body;

  const companyProvider = new CompanyProvider();

  await companyProvider
    .addCompany(companyData)
    .then(() => {
      res.status(201).json({ message: "company added successfully" });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ message: "Error adding company" });
    });
  await twilioInstance.registerPhoneNumber(
    companyData.numbers.twilio_phone_number
  );
});

export default companyRouter;
