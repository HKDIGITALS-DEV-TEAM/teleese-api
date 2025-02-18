import { Schema, Document } from "mongoose";

/**
 * Interface générique pour les entités de la base de données.
 */
export interface IBaseEntity extends Document {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Schéma de base pour les entités Mongoose.
 */
export const BaseEntitySchema = new Schema<IBaseEntity>(
  {
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);
