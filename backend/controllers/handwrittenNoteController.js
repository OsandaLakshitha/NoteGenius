const mongoose = require("mongoose");
const HandwrittenNote = require("../models/HandwrittenNote");
const Tag = require("../models/Tag");

// Create a new note
exports.createNote = async (req, res) => {
  try {
    const { title, content, userId, tags = [] } = req.body;

    if (
      tags &&
      (!Array.isArray(tags) ||
        tags.some((tag) => !mongoose.Types.ObjectId.isValid(tag)))
    ) {
      return res.status(400).json({ error: "One or more tags are invalid." });
    }

    if (tags && tags.length > 0) {
      const existingTags = await Tag.find({ _id: { $in: tags } });
      if (existingTags.length !== tags.length) {
        return res
          .status(400)
          .json({ error: "One or more tags do not exist." });
      }
    }

    const newNote = new HandwrittenNote({
      title,
      content,
      userId,
      tags: tags || [],
    });

    await newNote.save();
    const populatedNote = await newNote.populate("tags");
    res.status(201).json(populatedNote);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get all notes
exports.getNotes = async (req, res) => {
  try {
    const notes = await HandwrittenNote.find().populate("tags");
    res.status(200).json(notes);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get all notes by user id
exports.getNotesByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const notes = await HandwrittenNote.find({ userId }).populate("tags");
    res.status(200).json(notes);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Update a note
exports.updateNote = async (req, res) => {
  try {
    console.log("Updating note ID:", req.params.id);
    const { id } = req.params;
    const { title, content, userId, tags } = req.body;

    // First find the note
    const note = await HandwrittenNote.findById(id);

    if (!note) {
      console.log("Note not found:", id);
      return res.status(404).json({ error: "Note not found" });
    }

    // Check if the note belongs to the user making the request
    if (note.userId.toString() !== userId) {
      console.log("Unauthorized update attempt:", userId);
      return res
        .status(403)
        .json({ error: "Unauthorized: You can only update your own notes" });
    }

    // Validate tags if provided
    if (tags) {
      if (!Array.isArray(tags)) {
        return res.status(400).json({ error: "Tags must be an array" });
      }
      const validTags = await Tag.find({ _id: { $in: tags }, userId });
      if (validTags.length !== tags.length) {
        console.log("Invalid tags provided:", tags);
        return res.status(400).json({ error: "One or more tags are invalid or do not belong to the user" });
      }
    }

    // Store current note state in history
    note.history.push({
      title: note.title,
      content: note.content,
      tags: note.tags, // Include tags in history
      modifiedAt: new Date(),
    });

    // Limit history to 5 entries
    if (note.history.length > 5) {
      note.history = note.history.slice(-5);
    }

    // Update note fields
    note.title = title;
    note.content = content;
    note.tags = tags || note.tags; // Update tags if provided, else keep existing
    await note.save();
    console.log("Note updated:", note);
    res.status(200).json(note);
  } catch (err) {
    console.error("Update note error:", err);
    res.status(400).json({ error: err.message });
  }
};

// Delete a note
exports.deleteNote = async (req, res) => {
  try {
    const { id } = req.params;
    await HandwrittenNote.findByIdAndDelete(id);
    res.status(200).json({ message: "Note deleted successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get note history
exports.getNoteHistory = async (req, res) => {
  try {
    console.log(`Fetching history for note ID: ${req.params.id}`);
    const { id } = req.params;
    const note = await HandwrittenNote.findById(id);
    if (!note) {
      console.log(`Note with ID ${id} not found`);
      return res.status(404).json({ error: "Note not found" });
    }
    console.log(`Note found, history:`, note.history);
    res.status(200).json(note.history);
  } catch (err) {
    console.error(`Error fetching history for note ID ${req.params.id}:`, err);
    res.status(400).json({ error: `Failed to fetch history: ${err.message}` });
  }
};

// Revert to a specific version
exports.revertNote = async (req, res) => {
  try {
    console.log(
      "Reverting note ID:",
      req.params.id,
      "to version:",
      req.params.versionId
    );
    const { id, versionId } = req.params;
    const note = await HandwrittenNote.findById(id);
    if (!note) {
      return res.status(404).json({ error: "Note not found" });
    }
    const version = note.history.id(versionId);
    if (!version) {
      return res.status(404).json({ error: "Version not found" });
    }

    note.history.push({
      title: note.title,
      content: note.content,
      modifiedAt: new Date(),
    });

    note.title = version.title;
    note.content = version.content;

    if (note.history.length > 5) {
      note.history = note.history.slice(-5);
    }

    await note.save();
    res.status(200).json(note);
  } catch (err) {
    console.error("Revert note error:", err);
    res.status(400).json({ error: err.message });
  }
};

// Delete a specific version
exports.deleteVersion = async (req, res) => {
  try {
    console.log(
      "Deleting version ID:",
      req.params.versionId,
      "for note ID:",
      req.params.id
    );
    const { id, versionId } = req.params;
    const note = await HandwrittenNote.findById(id);
    if (!note) {
      return res.status(404).json({ error: "Note not found" });
    }
    const version = note.history.id(versionId);
    if (!version) {
      return res.status(404).json({ error: "Version not found" });
    }
    note.history.pull({ _id: versionId });
    await note.save();
    res.status(200).json(note.history);
  } catch (err) {
    console.error("Delete version error:", err);
    res.status(400).json({ error: err.message });
  }
};
