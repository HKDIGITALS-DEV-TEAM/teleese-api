import { IsNotEmpty, IsString, ValidateNested } from "class-validator";
import { Type } from "class-transformer";
import INumbers from "@features/company/data/schema/interfaces/INumbers";
import IConfiguration from "@features/company/data/schema/interfaces/IConfiguration";

/**
 * Classe de validation des requêtes liées aux entreprises.
 */
export class CompanyRequest {
  @IsNotEmpty({ message: "Le champ owner_id est obligatoire." })
  @IsString()
  owner_id!: string;

  @IsNotEmpty({ message: "Le champ name est obligatoire." })
  @IsString()
  name!: string;

  @IsNotEmpty({ message: "Le champ description est obligatoire." })
  @IsString()
  description!: string;

  @IsNotEmpty({ message: "Le champ category est obligatoire." })
  @IsString()
  category!: string;

  @ValidateNested()
  @Type(() => Object)
  numbers!: INumbers;

  @ValidateNested()
  @Type(() => Object)
  configurations!: IConfiguration;

  @IsString()
  option!: string;
}
