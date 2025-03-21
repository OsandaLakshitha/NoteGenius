const mongoose = require('mongoose');

const TagSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true, // Ensure tag names are unique
    trim: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('Tag', TagSchema);
