/**
 * Interface pour représenter les données d'un utilisateur.
 */
export interface IUserDTO {
  id: string;
  keycloakId: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
}
