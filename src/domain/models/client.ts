// models/Client.js
import mongoose from 'mongoose';

const clientSchema = new mongoose.Schema({
  nom: {
    type: String,
    required: true,
  },
  contact: {
    type: String,
    required: true,
  },
  reservations: [
    {
      etablissement_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Etablissement',
        required: true,
      },
      date: {
        type: Date,
        required: true,
      },
      statut: {
        type: String,
        required: true,
      },
    },
  ],
});

const Client = mongoose.model('Client', clientSchema);

export default Client;