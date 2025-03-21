const HandwrittenNote = require('../models/HandwrittenNote');
const Tag = require('../models/Tag');

// Create a new note
exports.createNote = async (req, res) => {
  try {
    const { title, content, tags } = req.body;
    const newNote = new HandwrittenNote({ title, content, tags });
    await newNote.save();
    res.status(201).json(newNote);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get all notes
exports.getNotes = async (req, res) => {
  try {
    const notes = await HandwrittenNote.find().populate('tags'); // Populate tags
    res.status(200).json(notes);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Update a note
exports.updateNote = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, tags } = req.body;
    const updatedNote = await HandwrittenNote.findByIdAndUpdate(
      id,
      { title, content, tags },
      { new: true }
    ).populate('tags'); // Populate tags after update

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

// Add a tag to a note
exports.addTagToNote = async (req, res) => {
  try {
    const { noteId, tagId } = req.params;
    const note = await HandwrittenNote.findById(noteId);
    if (!note) return res.status(404).json({ message: 'Note not found' });

    if (!note.tags.includes(tagId)) {
      note.tags.push(tagId);
      await note.save();
    }

    res.status(200).json(note);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Remove a tag from a note
exports.removeTagFromNote = async (req, res) => {
  try {
    const { noteId, tagId } = req.params;
    const note = await HandwrittenNote.findById(noteId);
    if (!note) return res.status(404).json({ message: 'Note not found' });

    note.tags = note.tags.filter(tag => tag.toString() !== tagId);
    await note.save();

    res.status(200).json(note);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
