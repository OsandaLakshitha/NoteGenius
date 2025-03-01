const mongoose = require('mongoose');

const VoiceNoteSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  transcript: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('VoiceNote', VoiceNoteSchema);