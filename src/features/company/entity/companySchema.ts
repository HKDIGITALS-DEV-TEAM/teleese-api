// models/User.js
import { userSchema } from '@features/auth/entity/userSchema';
import mongoose from 'mongoose';
import { configurationSchema } from './configurationSchema';

const companySchema = new mongoose.Schema({
  owner_id: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  users: {
    type: [userSchema],
    required: true
  },
  configurations: {
    type: configurationSchema,
    required: true
  },
  option: {
    type: String,
    required: true
  }
});

const Company = mongoose.model('company', companySchema);

export default Company;