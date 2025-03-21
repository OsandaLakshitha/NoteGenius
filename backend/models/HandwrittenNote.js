const mongoose = require('mongoose');

const HandwrittenNoteSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  tags: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tag', // Referencing the Tag model
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('HandwrittenNote', HandwrittenNoteSchema);
