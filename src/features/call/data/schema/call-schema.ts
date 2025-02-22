import mongoose, { Schema, Document, Model } from "mongoose";
import { ICall } from "./interfaces/ICall";
import { BaseEntitySchema } from "@core/base/base-entity";

/**
 * Schéma Mongoose pour les appels vocaux.
 */
const CallSchema: Schema<ICall> = new Schema(
  {
    sessionId: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    transcript: { type: String, default: "" },
    status: { type: String, enum: ["active", "completed", "failed"], required: true },
  },
  { timestamps: true }
);

// Appliquer les propriétés de base (BaseEntity)
CallSchema.add(BaseEntitySchema);

const Call: Model<ICall> = mongoose.model<ICall>("Call", CallSchema);

export { Call };
