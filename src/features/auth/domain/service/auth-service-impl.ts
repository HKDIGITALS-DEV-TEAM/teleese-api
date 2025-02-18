import { UserDAO } from "@features/auth/data/dao/user-dao-impl";
import { IAuthService } from "./auth-service";
import { RegisterRequest } from "@features/auth/presentation/request/register-request";
import { IUserDTO } from "@features/auth/presentation/dto/user-dto";
import { toUserDTO } from "@features/auth/presentation/dto/user-mapper";

/**
 * Implémentation du service d'authentification.
 */
export class AuthService implements IAuthService {
  private userDAO: UserDAO;

  constructor() {
    this.userDAO = new UserDAO();
  }

  /**
   * Enregistre un nouvel utilisateur après validation.
   * @param {RegisterRequest} request - Données de l'utilisateur.
   * @returns {Promise<IUserDTO>} L'utilisateur enregistré sous forme de DTO.
   */
  async register(request: RegisterRequest): Promise<IUserDTO> {
    const newUser = await this.userDAO.create({
      keycloakId: request.keycloakId,
      firstName: request.firstName,
      lastName: request.lastName,
      email: request.email,
      role: request.role,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return toUserDTO(newUser);
  }

  /**
   * Recherche un utilisateur par email et retourne un DTO.
   * @param {string} email - Email de l'utilisateur.
   * @returns {Promise<IUserDTO | null>} L'utilisateur trouvé ou `null`.
   */
  async getUserByEmail(email: string): Promise<IUserDTO | null> {
    const user = await this.userDAO.findByEmail(email);
    return user ? toUserDTO(user) : null;
  }

  /**
   * Recherche un utilisateur par son keycloak ID et retourne un DTO.
   * @param {string} kid - Keyclaok ID de l'utilisateur.
   * @returns {Promise<IUserDTO | null>} L'utilisateur trouvé ou `null`.
   */
  async getUserByKeycloakId(kid: string): Promise<IUserDTO | null> {
    const user = await this.userDAO.findByKeycloakId(kid);
    return user ? toUserDTO(user) : null;
  }
}
