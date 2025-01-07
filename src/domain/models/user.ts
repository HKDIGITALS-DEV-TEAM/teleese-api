// models/User.js
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  first_name: {
    type: String,
    required: true,
    unique: true,
  },
  last_name: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  // contact: {
  //   type: String,
  //   required: false,
  // },
  // etablissements: [
  //   {
  //     type: mongoose.Schema.Types.ObjectId,
  //     ref: 'Etablissement',
  //   },
  // ],
});

const User = mongoose.model('User', userSchema);

export default User;