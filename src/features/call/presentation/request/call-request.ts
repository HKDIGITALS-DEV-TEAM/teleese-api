import { IsString, IsNotEmpty, IsIn } from "class-validator";

/**
 * Requête pour la création ou la gestion d'un appel vocal.
 */
export class CallRequest {
  @IsString()
  @IsNotEmpty({ message: "Le champ sessionId est obligatoire." })
  sessionId!: string;

  @IsString()
  @IsNotEmpty({ message: "Le champ phoneNumber est obligatoire." })
  phoneNumber!: string;

  @IsString()
  @IsIn(["active", "completed", "failed"], {
    message: "Le statut doit être 'active', 'completed' ou 'failed'.",
  })
  status!: "active" | "completed" | "failed";
}
