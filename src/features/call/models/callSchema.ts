import { companySchema } from "@features/company/entity/companySchema";
import mongoose from "mongoose";
import { CallStatus } from "../interfaces/callStatus";

const callSchema = new mongoose.Schema({
  callStartTime: {
    type: Date,
    required: true,
  },
  callEndTime: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
  from: {
    type: Number,
    required: true,
  },
  toReal: {
    type: Number,
    required: true,
  },
  toTwilio: {
    type: Number,
    required: true,
  },
  companyId: {
    type: companySchema,
    required: true,
  },
  transcript: [
    {
      speaker: String,
      message: String,
      timestamp: Date,
      sentiment: Number,
    },
  ],
  chatGPTResponses: [
    {
      prompt: String,
      responseText: String,
      model: String,
      modelParameters: {
        temperature: Number,
        maxTokens: Number,
      },
      createdAt: Date,
      responseTime: Number,
    },
  ],
});


const Call = mongoose.model("call", callSchema)

export default Call