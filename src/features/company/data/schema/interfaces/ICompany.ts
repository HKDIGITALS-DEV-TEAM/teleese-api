import INumbers from "./INumbers";
import IConfiguration from "./IConfiguration";
import { IBaseEntity } from "@core/base/base-entity";

/**
 * Interface représentant une entreprise.
 */
export interface ICompany extends IBaseEntity {
  owner_id: string;
  name: string;
  description: string;
  category: string;
  numbers: INumbers;
  configurations: IConfiguration;
  option: string;
}
