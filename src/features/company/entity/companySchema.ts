// models/User.js
import { userSchema } from '@features/auth/entity/userSchema';
import mongoose from 'mongoose';
import { configurationSchema } from './configurationSchema';
import NumbersSchema from './numberSchema';

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
  numbers : {
    type : NumbersSchema,
    require : true,
  },
  configurations: {
    type: configurationSchema,
    required: false
  },
  option: {
    type: String,
    required: false
  }
});

const Company = mongoose.model('company', companySchema);

export default Company;