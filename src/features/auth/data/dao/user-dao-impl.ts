import { UserRepository } from "../repository/user-repository";
import { IUser } from "../schema/interfaces/IUser";
import { IUserDAO } from "./user-dao";

/**
 * Implémentation du DAO pour la gestion des utilisateurs.
 */
export class UserDAO implements IUserDAO {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  /**
   * Crée un nouvel utilisateur après validation.
   * @param {Partial<IUser>} user - L'utilisateur à créer.
   * @returns {Promise<IUser>} L'utilisateur créé.
   */
  async create(user: Partial<IUser>): Promise<IUser> {
    if (!user.email || !user.keycloakId) {
      throw new Error("Les champs obligatoires sont manquants.");
    }

    const existingUser = await this.userRepository.findByEmail(user.email);
    if (existingUser) {
      throw new Error("Un utilisateur avec cet email existe déjà.");
    }

    return await this.userRepository.create(user);
  }

  /**
   * Recherche un utilisateur par email.
   * @param {string} email - Email de l'utilisateur.
   * @returns {Promise<IUser | null>} L'utilisateur trouvé ou `null`.
   */
  async findByEmail(email: string): Promise<IUser | null> {
    return await this.userRepository.findByEmail(email);
  }

  /**
   * Recherche un utilisateur par son identifiant Keycloak.
   * @param {string} kid - ID Keycloak.
   * @returns {Promise<IUser | null>} L'utilisateur trouvé ou `null`.
   */
  async findByKeycloakId(kid: string): Promise<IUser | null> {
    return await this.userRepository.findByKeycloakId(kid);
  }
}
