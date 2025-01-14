// models/SubCategory.js
import mongoose from 'mongoose';

const subCategorySchema = new mongoose.Schema({
  AIOption: {
    FAQ: [
      {
        Question: {
          type: String,
          required: true,
        },
        Response: {
          type: String,
          required: true,
        },
      },
    ],
  },
  reservationPolicy: [
    {
      type: String,
    },
  ],
});

const SubCategory = mongoose.model('SubCategory', subCategorySchema);

export default SubCategory;