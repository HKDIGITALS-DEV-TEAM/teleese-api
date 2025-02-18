import { IUser } from "../schema/interfaces/IUser";
import { User } from "../schema/user-schema";

/**
 * Repository pour la gestion des utilisateurs dans la base de données.
 */
export class UserRepository {
  /**
   * Crée un nouvel utilisateur dans la base de données.
   * @param {Partial<IUser>} user - Les données de l'utilisateur à créer.
   * @returns {Promise<IUser>} L'utilisateur créé.
   */
  async create(user: Partial<IUser>): Promise<IUser> {
    return await User.create(user);
  }

  /**
   * Trouve un utilisateur par son email.
   * @param {string} email - Email de l'utilisateur à rechercher.
   * @returns {Promise<IUser | null>} L'utilisateur trouvé ou `null` s'il n'existe pas.
   */
  async findByEmail(email: string): Promise<IUser | null> {
    return await User.findOne({ email });
  }

  /**
   * Trouve un utilisateur par son identifiant Keycloak.
   * @param {string} kid - ID Keycloak de l'utilisateur.
   * @returns {Promise<IUser | null>} L'utilisateur trouvé ou `null` s'il n'existe pas.
   */
  async findByKeycloakId(kid: string): Promise<IUser | null> {
    return await User.findOne({ kid });
  }
}
