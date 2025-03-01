const VoiceNote = require('../models/VoiceNote');

// Create a voice note
exports.createVoiceNote = async (req, res) => {
  try {
    const { title, transcript } = req.body;
    const newVoiceNote = new VoiceNote({ title, transcript });
    await newVoiceNote.save();
    res.status(201).json(newVoiceNote);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get all voice notes
exports.getVoiceNotes = async (req, res) => {
  try {
    const voiceNotes = await VoiceNote.find();
    res.status(200).json(voiceNotes);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete a voice note
exports.deleteVoiceNote = async (req, res) => {
  try {
    const { id } = req.params;
    await VoiceNote.findByIdAndDelete(id);
    res.status(200).json({ message: 'Voice note deleted' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};