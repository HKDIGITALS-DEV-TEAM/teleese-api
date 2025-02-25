import { IsEmail, IsNotEmpty, Length } from "class-validator";

/**
 * Classe de validation pour l'enregistrement d'un utilisateur.
 */
export class RegisterRequest {
  @IsNotEmpty({ message: "L'identifiant Keycloak est obligatoire." })
  keycloakId!: string;

  @IsNotEmpty({ message: "Le prénom est obligatoire." })
  @Length(2, 30, { message: "Le prénom doit avoir entre 2 et 30 caractères." })
  firstName!: string;

  @IsNotEmpty({ message: "Le nom est obligatoire." })
  @Length(2, 30, { message: "Le nom doit avoir entre 2 et 30 caractères." })
  lastName!: string;

  @IsEmail({}, { message: "L'email fourni est invalide." })
  @IsNotEmpty({ message: "L'email est obligatoire." })
  email!: string;

  @IsNotEmpty({ message: "Le rôle est obligatoire." })
  role!: string;
}
