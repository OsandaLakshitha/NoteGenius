const express = require('express');
const router = express.Router();
const {
  createVoiceNote,
  getVoiceNotes,
  deleteVoiceNote,
} = require('../controllers/voiceNoteController');

router.post('/', createVoiceNote);
router.get('/', getVoiceNotes);
router.delete('/:id', deleteVoiceNote);

module.exports = router;