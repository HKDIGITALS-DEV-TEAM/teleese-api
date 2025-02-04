import mongoose from "mongoose";
import { configurationSchema } from "./configurationSchema";

const NumbersSchema = new mongoose.Schema({
  phone_number: {
    type: String,
    require: true,
  },
  twilio_phone_number: {
    type: String,
    require: true,
  },
  secondary_phone_number: {
    type: String,
    require: true,
  },
});


export default NumbersSchema