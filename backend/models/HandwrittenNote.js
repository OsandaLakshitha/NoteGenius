const mongoose = require('mongoose');

const HandwrittenNoteSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  tags: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tag' }], // Ensure tags are stored as ObjectId references
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('HandwrittenNote', HandwrittenNoteSchema);
