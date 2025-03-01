const HandwrittenNote = require('../models/HandwrittenNote');

// Create a new note
exports.createNote = async (req, res) => {
  try {
    const { title, content } = req.body;
    const newNote = new HandwrittenNote({ title, content });
    await newNote.save();
    res.status(201).json(newNote);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get all notes
exports.getNotes = async (req, res) => {
  try {
    const notes = await HandwrittenNote.find();
    res.status(200).json(notes);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Update a note
exports.updateNote = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content } = req.body;
    const updatedNote = await HandwrittenNote.findByIdAndUpdate(
      id,
      { title, content },
      { new: true }
    );
    res.status(200).json(updatedNote);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete a note
exports.deleteNote = async (req, res) => {
  try {
    const { id } = req.params;
    await HandwrittenNote.findByIdAndDelete(id);
    res.status(200).json({ message: 'Note deleted successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};