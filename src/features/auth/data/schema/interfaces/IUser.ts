import { IBaseEntity } from "@core/base/base-entity";

/**
 * Interface représentant la structure d'un utilisateur.
 */
export interface IUser extends IBaseEntity {
  keycloakId: string; // Identifiant unique Keycloak (Obligatoire)
  firstName: string;
  lastName: string;
  email: string;
  role: string; // Rôle de l'utilisateur (Obligatoire)
}
