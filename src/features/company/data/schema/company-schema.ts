import mongoose, { Schema, Model } from "mongoose";
import NumbersSchema from "./number-schema";
import { ICompany } from "./interfaces/ICompany";
import { BaseEntitySchema } from "@core/base/base-entity";
import { ConfigurationSchema } from "./configuration-schema";

/**
 * Schéma Mongoose pour une entreprise.
 */
const CompanySchema: Schema<ICompany> = new Schema(
  {
    owner_id: { type: String, required: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    numbers: { type: NumbersSchema, required: true },
    configurations: { type: ConfigurationSchema, required: false },
    option: { type: String, required: false },
  },
  { timestamps: true }
);

// Appliquer les champs communs (BaseEntity)
CompanySchema.add(BaseEntitySchema);

const Company: Model<ICompany> = mongoose.model<ICompany>(
  "Company",
  CompanySchema
);

export default Company;
