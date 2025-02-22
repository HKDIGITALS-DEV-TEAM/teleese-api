import { IUserDTO } from "@features/auth/presentation/dto/user-dto";
import { RegisterRequest } from "@features/auth/presentation/request/register-request";

/**
 * Interface pour la gestion de l'authentification.
 */
export interface IAuthService {
  register(request: RegisterRequest): Promise<IUserDTO>;
  getUserByEmail(email: string): Promise<IUserDTO | null>;
  getUserByKeycloakId(kid: string): Promise<IUserDTO | null>;
}
