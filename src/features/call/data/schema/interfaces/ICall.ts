import { IBaseEntity } from "@core/base/base-entity";

/**
 * Interface représentant un appel vocal.
 */
export interface ICall extends IBaseEntity {
  sessionId: string;
  phoneNumber: string;
  transcript: string;
  status: "active" | "completed" | "failed";
}
