import { ICall } from "../../data/schema/interfaces/ICall";
import { ICallDTO } from "./call-dto";

/**
 * Convertit une entité Call en DTO.
 * @param call - L'entité Call issue de la base de données.
 * @returns Un objet DTO contenant les données nécessaires.
 */
export function toCallDTO(call: ICall): ICallDTO {
  return {
    id: call._id?.toString() || "",
    sessionId: call.sessionId,
    phoneNumber: call.phoneNumber,
    transcript: call.transcript,
    status: call.status,
    createdAt: call.createdAt,
    updatedAt: call.updatedAt,
  };
}

/**
 * Convertit un DTO Call en entité Call.
 * @param dto - Le DTO Call.
 * @returns Une entité ICall prête pour MongoDB.
 */
export function toCallEntity(dto: ICallDTO): ICall {
  return {
    _id: dto.id,
    sessionId: dto.sessionId,
    phoneNumber: dto.phoneNumber,
    transcript: dto.transcript,
    status: dto.status,
    createdAt: dto.createdAt,
    updatedAt: dto.updatedAt,
  } as ICall;
}
