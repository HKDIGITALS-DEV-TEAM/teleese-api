/**
 * Interface DTO pour représenter un appel vocal.
 */
export interface ICallDTO {
    id: string;
    sessionId: string;
    phoneNumber: string;
    transcript: string;
    status: "active" | "completed" | "failed";
    createdAt: Date;
    updatedAt: Date;
  }
  