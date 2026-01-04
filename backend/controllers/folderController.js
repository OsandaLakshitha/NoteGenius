const Folder = require("../models/Folder");
const HandwrittenNote = require("../models/HandwrittenNote");
const StructuredText = require("../models/StructuredText");
const VoiceNote = require("../models/VoiceNote");
const predefinedColors = ["red", "blue", "green", "yellow", "purple", "orange"];
const mongoose = require("mongoose");

//Create folder
const createFolder = async (req, res) => {
  try {
    const { name, color, userId } = req.body;

    if (color && !predefinedColors.includes(color)) {
      return res.status(400).json({ error: "Invalid color selection" });
    }

    // Check if a folder with the same name already exists for the user
    const existingFolder = await Folder.findOne({ name, userId });
    if (existingFolder) {
      return res
        .status(400)
        .json({ error: "Folder name already exists for this user" });
    }

    const newFolder = new Folder({ name, color, userId });
    await newFolder.save();
    res.status(200).json(newFolder);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//Get All folders
const getFolders = async (req, res) => {
  try {
    const folders = await Folder.find();
    res.status(200).json(folders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//get all folders by user id
const getFoldersusr = async (req, res) => {
  try {
    const { userId } = req.params;
    const folders = await Folder.find({ userId });
    res.status(200).json(folders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//Get folder by ID
const getFolderById = async (req, res) => {
  try {
    const folder = await Folder.findById(req.params.id);
    if (!folder) {
      return res.status(404).json({ error: "Folder not found" });
    }
    res.status(200).json(folder);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//Update Folder (color,name)
const updateFolder = async (req, res) => {
  try {
    const { id } = req.params; // Folder ID from URL
    const { name, color, userId } = req.body; // Include userId from the request body

    // Check if folder exists and belongs to the user
    const folder = await Folder.findOne({ _id: id, userId });
    if (!folder) {
      return res
        .status(404)
        .json({ error: "Folder not found or unauthorized" });
    }

    // Validate name (Ensure it's unique for the user, excluding the current folder)
    const existingFolder = await Folder.findOne({
      name,
      userId,
      _id: { $ne: id },
    });
    if (existingFolder) {
      return res.status(400).json({
        error:
          "Folder name already exists for this user. Choose a different name.",
      });
    }

    // Update folder
    folder.name = name || folder.name;
    folder.color = color || folder.color;
    await folder.save();

    res.status(200).json({ message: "Folder updated successfully", folder });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//Delete Folder
const deleteFolder = async (req, res) => {
  try {
    const { id } = req.params;

    // 1️⃣ Check if ID format is valid (prevents errors)
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid folder ID" });
    }

    // 2️⃣ Check if the folder exists before deleting
    const folder = await Folder.findById(id);
    if (!folder) {
      return res.status(404).json({ error: "Folder not found" });
    }

    // 3️⃣ Remove notes from the folder without deleting the notes themselves
    folder.notes = [];
    await folder.save();

    // 4️⃣ Delete the folder (Now we are sure it exists)
    await Folder.findByIdAndDelete(id);

    return res.status(200).json({ message: "Folder deleted successfully" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// // Add note to folder
// const addNoteToFolder = async (req, res) => {
//     try {
//         const { id } = req.params; // Folder ID from URL
//         const { noteId, type } = req.body;

//         // Check if folder exists
//         const folder = await Folder.findById(id);
//         if (!folder) {
//             return res.status(404).json({ error: 'Folder not found' });
//         }

//         // Check if note exists in another folder
//         const existingFolder = await Folder.findOne({ 'notes.noteId': noteId });
//         if (existingFolder) {
//             // Remove note from the existing folder
//             existingFolder.notes = existingFolder.notes.filter(note => note.noteId.toString() !== noteId);
//             await existingFolder.save();
//         }

//         // Add note to folder
//         folder.notes.push({ noteId, type });
//         await folder.save();

//         res.status(200).json({ message: 'Note added to folder successfully', folder });
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// };

// Add note to folder
const addNoteToFolder = async (req, res) => {
  try {
    const { id } = req.params; // Folder ID
    const { noteId, userId } = req.body; // Note ID and logged-in user's ID

    // Validate if the folder exists and belongs to the user
    const folder = await Folder.findOne({ _id: id, userId });
    if (!folder) {
      return res
        .status(404)
        .json({ error: "Folder not found or unauthorized" });
    }

    let type = null;
    let noteExists = false;

    // Determine the type automatically and check if user owns the note
    const handwrittenNote = await HandwrittenNote.findOne({
      _id: noteId,
      userId,
    });
    if (handwrittenNote) {
      type = "HandwrittenNote";
      noteExists = true;
    }

    if (!noteExists) {
      const structuredText = await StructuredText.findOne({
        _id: noteId,
        userId,
      });
      if (structuredText) {
        type = "StructuredText";
        noteExists = true;
      }
    }

    if (!noteExists) {
      const voiceNote = await VoiceNote.findOne({ _id: noteId, userId });
      if (voiceNote) {
        type = "VoiceNote";
        noteExists = true;
      }
    }

    if (!noteExists) {
      return res
        .status(404)
        .json({ error: "Note not found or doesn't belong to this user" });
    }

    // Remove note from another folder if it exists (only from user's folders)
    const existingFolder = await Folder.findOne({
      "notes.noteId": noteId,
      userId,
    });
    if (existingFolder) {
      existingFolder.notes = existingFolder.notes.filter(
        (note) => note.noteId.toString() !== noteId
      );
      await existingFolder.save();
    }

    // Add note to the new folder
    folder.notes.push({ noteId, type });
    await folder.save();

    res
      .status(200)
      .json({ message: "Note added to folder successfully", folder });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Retrieve notes inside folder
const getNotesInFolder = async (req, res) => {
  try {
    const { id } = req.params; // Folder ID from URL

    // Check if folder exists
    const folder = await Folder.findById(id).populate("notes.noteId");
    if (!folder) {
      return res.status(404).json({ error: "Folder not found" });
    }

    res.status(200).json({ notes: folder.notes });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Remove note from folder
const removeNoteFromFolder = async (req, res) => {
  try {
    const { id, noteId } = req.params; // Folder ID and Note ID from URL

    // Check if folder exists
    const folder = await Folder.findById(id);
    if (!folder) {
      return res.status(404).json({ error: "Folder not found" });
    }

    // Remove note from folder
    folder.notes = folder.notes.filter(
      (note) => note.noteId.toString() !== noteId
    );
    await folder.save();

    res
      .status(200)
      .json({ message: "Note removed from folder successfully", folder });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createFolder,
  getFolders,
  getFoldersusr,
  getFolderById,
  updateFolder,
  deleteFolder,
  addNoteToFolder,
  getNotesInFolder,
  removeNoteFromFolder,
};
