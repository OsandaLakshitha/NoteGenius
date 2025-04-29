const mongoose = require('mongoose');
const HandwrittenNote = require('../models/HandwrittenNote');
const Tag = require('../models/Tag');

// Create a new note
exports.createNote = async (req, res) => {
  try {
    const { title, content, tags } = req.body;

    if (!title || !content) {
      return res.status(400).json({ error: 'Title and content are required.' });
    }

    if (!Array.isArray(tags) || tags.some(tag => !mongoose.Types.ObjectId.isValid(tag))) {
      return res.status(400).json({ error: 'One or more tags are invalid.' });
    }

    const existingTags = await Tag.find({ _id: { $in: tags } });
    if (existingTags.length !== tags.length) {
      return res.status(400).json({ error: 'One or more tags do not exist.' });
    }

    const newNote = new HandwrittenNote({ 
      title, 
      content, 
      tags: existingTags.map(tag => tag._id),
    });

    await newNote.save();
    const populatedNote = await newNote.populate('tags');
    res.status(201).json(populatedNote);
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err.message });
  }
};

// Get all notes
exports.getNotes = async (req, res) => {
  try {
    const notes = await HandwrittenNote.find().populate('tags');
    res.status(200).json(notes);
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err.message });
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
    ).populate('tags');

    if (!updatedNote) {
      return res.status(404).json({ error: 'Note not found.' });
    }

    res.status(200).json(updatedNote);
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err.message });
  }
};

// Delete a note
exports.deleteNote = async (req, res) => {
  try {
    const { id } = req.params;
    const note = await HandwrittenNote.findByIdAndDelete(id);

    if (!note) {
      return res.status(404).json({ error: 'Note not found.' });
    }

    res.status(200).json({ message: 'Note deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err.message });
  }
};