import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { validate } from "class-validator";
import logger from "@infrastructure/logger/logger";
import { ValidationException } from "@core/exceptions/validation-exception";
import { AuthService } from "@features/auth/domain/service/auth-service-impl";
import { RegisterRequest } from "@features/auth/presentation/request/register-request";
import { GlobalException } from "@core/exceptions/global-exception";

/**
 * Middleware pour vérifier et créer un utilisateur.
 *
 * @param {Request} req - La requête HTTP.
 * @param {Response} res - La réponse HTTP.
 * @param {NextFunction} next - Fonction pour passer au middleware suivant.
 * @returns {Promise<void>}
 */
export const checkAndCreateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Vérification du token
    const authorizationHeader = req.headers.authorization;
    if (!authorizationHeader) {
      logger.warn("Tentative d'accès sans token.");
      throw new ValidationException("Token manquant dans les en-têtes.");
    }

    const token = authorizationHeader.split(" ")[1];
    const decoded = jwt.decode(token, { complete: true });

    if (!decoded) {
      throw new ValidationException("Token invalide.");
    }

    const payload = decoded.payload as JwtPayload;
    const kid = decoded.header?.kid as string | undefined;

    if (!kid) {
      throw new ValidationException("L'ID utilisateur (Keycloak) est manquant.");
    }

    const { preferred_username, given_name, family_name, email, realm_access } = payload;

    if (!realm_access || !realm_access.roles) {
      throw new ValidationException("Rôles utilisateur introuvables dans le token.");
    }

    const roles = realm_access.roles.filter(
      (role: string) =>
        !["offline_access", "uma_authorization", "default-roles-teleese"].includes(role)
    );

    if (!roles.length) {
      throw new ValidationException("Aucun rôle utilisateur valide trouvé.");
    }

    const authService = new AuthService();

    let user = await authService.getUserByKeycloakId(kid);

    if (!user) {
      // Construire la requête de validation
      const registerRequest = new RegisterRequest();
      registerRequest.keycloakId = kid;
      registerRequest.firstName = given_name || "Utilisateur";
      registerRequest.lastName = family_name || "Inconnu";
      registerRequest.email = email;
      registerRequest.role = roles[0];

      // Validation des données utilisateur
      const errors = await validate(registerRequest);
      if (errors.length > 0) {
        throw new ValidationException("Données utilisateur invalides", errors);
      }

      // Enregistrer l'utilisateur via AuthService
      user = await authService.register(registerRequest);
      logger.info(`✅ Nouvel utilisateur créé : ${user.id}`);
    } else {
      logger.info(`✅ Utilisateur existant vérifié : ${kid}`);
    }

    next();
  } catch (error: unknown) {
    logger.error(`❌ Erreur dans le middleware checkAndCreateUser : ${error}`);
    res.status(500).json(new GlobalException("Erreur interne du serveur", 500, "MIDDLEWARE_ERROR"));
  }
};
