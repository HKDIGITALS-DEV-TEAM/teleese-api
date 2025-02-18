import { Schema } from "mongoose";

/**
 * Schéma Mongoose pour les numéros de téléphone d'une entreprise.
 */
const NumbersSchema = new Schema({
  phone_number: { type: String, required: true },
  twilio_phone_number: { type: String, required: true },
  secondary_phone_number: { type: String, required: true },
});

export default NumbersSchema;
