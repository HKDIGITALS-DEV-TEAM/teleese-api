import { IUser } from "../schema/interfaces/IUser";

/**
 * Interface définissant les méthodes DAO pour la gestion des utilisateurs.
 */
export interface IUserDAO {
  create(user: IUser): Promise<IUser>;
  findByEmail(email: string): Promise<IUser | null>;
  findByKeycloakId(kid: string): Promise<IUser | null>;
}
