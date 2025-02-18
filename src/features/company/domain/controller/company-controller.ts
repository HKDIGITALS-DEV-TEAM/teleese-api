import { Router, Request, Response } from "express";
import { validate } from "class-validator";
import { CompanyRequest } from "@features/company/presentation/request/company-request";
import { GlobalException } from "@core/exceptions/global-exception";
import { CompanyServiceImpl } from "../services/company-service-impl";

const companyRouter = Router();
const companyService = new CompanyServiceImpl();

/**
 * @swagger
 * tags:
 *   name: Company
 *   description: Gestion des entreprises
 */

/**
 * @swagger
 * /company:
 *   post:
 *     summary: Créer une nouvelle entreprise et enregistrer un numéro Twilio
 *     tags: [Company]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CompanyRequest'
 *     responses:
 *       201:
 *         description: Entreprise créée avec succès et numéro Twilio enregistré.
 *       400:
 *         description: Données invalides
 *       500:
 *         description: Erreur interne
 */
companyRouter.post("/", async (req: Request, res: Response) => {
  try {
    const request = Object.assign(new CompanyRequest(), req.body);
    const errors = await validate(request);

    if (errors.length > 0) {
      throw new GlobalException(
        "Requête invalide",
        400,
        "VALIDATION_ERROR",
        errors
      );
    }

    const companyDTO = await companyService.createCompany(request);
    res.status(201).json(companyDTO);
  } catch (error) {
    const formattedError = new GlobalException(
      "Erreur lors de la création de l'entreprise",
      500,
      "COMPANY_CREATION_ERROR",
      error
    );
    res.status(formattedError.statusCode).json(formattedError);
  }
});

/**
 * @swagger
 * /company/{id}:
 *   get:
 *     summary: Récupérer les détails d'une entreprise
 *     tags: [Company]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de l'entreprise
 *     responses:
 *       200:
 *         description: Entreprise trouvée
 *       404:
 *         description: Entreprise introuvable
 */
companyRouter.get("/:id", async (req: Request, res: Response) => {
  try {
    const companyDTO = await companyService.getCompanyById(req.params.id);
    if (!companyDTO) {
      throw new GlobalException(
        "Entreprise introuvable",
        404,
        "COMPANY_NOT_FOUND"
      );
    }
    res.status(200).json(companyDTO);
  } catch (error) {
    const formattedError = new GlobalException(
      "Erreur lors de la récupération de l'entreprise",
      500,
      "COMPANY_FETCH_ERROR",
      error
    );
    res.status(formattedError.statusCode).json(formattedError);
  }
});

/**
 * @swagger
 * /company/{id}:
 *   put:
 *     summary: Mettre à jour les informations d'une entreprise
 *     tags: [Company]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de l'entreprise à mettre à jour
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CompanyRequest'
 *     responses:
 *       200:
 *         description: Entreprise mise à jour avec succès
 *       400:
 *         description: Données invalides
 */
companyRouter.put("/:id", async (req: Request, res: Response) => {
  try {
    const request = Object.assign(new CompanyRequest(), req.body);
    const errors = await validate(request);

    if (errors.length > 0) {
      throw new GlobalException(
        "Requête invalide",
        400,
        "VALIDATION_ERROR",
        errors
      );
    }

    const updatedCompany = await companyService.updateCompany(
      req.params.id,
      request
    );
    if (!updatedCompany) {
      throw new GlobalException(
        "Entreprise introuvable",
        404,
        "COMPANY_NOT_FOUND"
      );
    }

    res.status(200).json(updatedCompany);
  } catch (error) {
    const formattedError = new GlobalException(
      "Erreur lors de la mise à jour de l'entreprise",
      500,
      "COMPANY_UPDATE_ERROR",
      error
    );
    res.status(formattedError.statusCode).json(formattedError);
  }
});

/**
 * @swagger
 * /company/{id}:
 *   delete:
 *     summary: Supprimer une entreprise
 *     tags: [Company]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de l'entreprise à supprimer
 *     responses:
 *       200:
 *         description: Entreprise supprimée avec succès
 *       404:
 *         description: Entreprise introuvable
 */
companyRouter.delete("/:id", async (req: Request, res: Response) => {
  try {
    const isDeleted = await companyService.deleteCompany(req.params.id);
    if (!isDeleted) {
      throw new GlobalException(
        "Entreprise introuvable",
        404,
        "COMPANY_NOT_FOUND"
      );
    }
    res.status(200).json({ message: "Entreprise supprimée avec succès." });
  } catch (error) {
    const formattedError = new GlobalException(
      "Erreur lors de la suppression de l'entreprise",
      500,
      "COMPANY_DELETE_ERROR",
      error
    );
    res.status(formattedError.statusCode).json(formattedError);
  }
});

export default companyRouter;
