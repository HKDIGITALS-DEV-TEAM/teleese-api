// models/Etablissement.js
import mongoose from 'mongoose';

const companySchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  coOwner: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
  nom: {
    type: String,
    required: true,
  },
  adresse: {
    type: String,
    required: true,
  },
  services: [
    {
      type: String,
    },
  ],
  numero: {
    type: Number,
    required: true,
  },
  categorie: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
  },
  reservationContext: {
    calendarURL: {
      type: String,
    },
  },
  configurationVocale: {
    voiceURL: {
      type: String,
    },
  },
  contexteEtablissement: {
    // Vous pouvez ajouter des champs spécifiques ici si nécessaire
  },
  appels: [
    {
      inboundNumber: {
        type: Number,
        required: true,
      },
      durée: {
        type: Number,
        required: true,
      },
      contenu: {
        type: String,
        required: true,
      },
    },
  ],
});

const Company = mongoose.model('Company', companySchema);

export default Company;