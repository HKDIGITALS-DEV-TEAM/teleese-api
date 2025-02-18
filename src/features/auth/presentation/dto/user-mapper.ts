import { IUser } from "../../data/schema/interfaces/IUser";
import { IUserDTO } from "./user-dto";

/**
 * Convertit une entité utilisateur (IUser) en DTO (IUserDTO).
 * @param user - L'entité utilisateur issue de la base de données.
 * @returns Un objet DTO contenant les données nécessaires.
 */
export function toUserDTO(user: IUser): IUserDTO {
  return {
    id: user._id?.toString() || "", // ✅ Conversion sécurisée
    keycloakId: user.keycloakId,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt ?? new Date(),
    updatedAt: user.updatedAt ?? new Date(),
  };
}

/**
 * Convertit un DTO utilisateur (IUserDTO) en entité utilisateur (IUser).
 * @param dto - Le DTO de l'utilisateur.
 * @returns Une entité IUser prête à être utilisée avec Mongoose.
 */
export function toUserEntity(dto: IUserDTO): IUser {
  return {
    _id: dto.id,
    keycloakId: dto.keycloakId,
    firstName: dto.firstName,
    lastName: dto.lastName,
    email: dto.email,
    role: dto.role,
    createdAt: dto.createdAt,
    updatedAt: dto.updatedAt,
  } as IUser;
}
