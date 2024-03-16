const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
  filename: {
    type: String,
    required: true,
  },
  originalName: {
    type: String,
    required: true,
  },
  path: {
    type: String,
    required: true,
  },
  
}, { timestamps: true });

const Image = mongoose.model('Image', imageSchema);

module.exports = Image;
