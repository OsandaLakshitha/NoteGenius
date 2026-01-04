const mongoose = require('mongoose');

const HandwrittenNoteSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  tags: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Tag' 
  }],
  history: [{
    title: String,
    content: String,
    modifiedAt: {
      type: Date,
      default: Date.now
    }
  }]
});


module.exports = mongoose.model('HandwrittenNote', HandwrittenNoteSchema);