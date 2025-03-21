const express = require('express');
const router = express.Router();
const {
  createNote,
  getNotes,
  updateNote,
  deleteNote,
  addTagToNote,
  removeTagFromNote,
} = require('../controllers/handwrittenNoteController');

router.post('/', createNote);
router.get('/', getNotes);
router.put('/:id', updateNote);
router.delete('/:id', deleteNote);

// Tagging routes
router.post('/:noteId/tags/:tagId', addTagToNote);
router.delete('/:noteId/tags/:tagId', removeTagFromNote);

module.exports = router;
