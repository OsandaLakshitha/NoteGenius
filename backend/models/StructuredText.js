const mongoose = require('mongoose');

const StructuredTextSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  extractedText: {
    type: String,
    required: true,
  },
  imagePath: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('StructuredText', StructuredTextSchema);