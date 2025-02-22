import mongoose, { Schema } from "mongoose";
import { IUser } from "./interfaces/IUser";
import { BaseEntitySchema } from "@core/base/base-entity";

/**
 * Schéma Mongoose pour les utilisateurs.
 */
const UserSchema: Schema<IUser> = new Schema(
  {
    keycloakId: { type: String, required: true, unique: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    role: { type: String, required: true },
  },
  { timestamps: true }
);

// Appliquer les propriétés de base (BaseEntity)
UserSchema.add(BaseEntitySchema);

export const User = mongoose.model<IUser>("User", UserSchema);
