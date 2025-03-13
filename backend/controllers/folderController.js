const Folder = require('../models/Folder');
const HandwrittenNote = require('../models/HandwrittenNote');
const StructuredText = require('../models/StructuredText');
const VoiceNote = require('../models/VoiceNote');
const predefinedColors = ['red', 'blue', 'green', 'yellow', 'purple', 'orange'];
const mongoose = require('mongoose');

//Create folder
const createFolder = async (req, res) => {
    try {
        const{name,color} = req.body;

        //validate color 
        if(color && !predefinedColors.includes(color)) {
            return res.status(400).json({error: 'Invalid color Selection'});
        }

        //check existing folder for prevent duplication
        const existingFolder = await Folder.findOne({name});
        if(existingFolder){
            return res.status(400).json({error: 'Folder name already exists. Choose different name '});
        }

        const newFolder = new Folder({name,color});
        await newFolder.save();
        res.status(200).json(newFolder);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
};

//Get All folders
const getFolders = async (req,res) => {
    try {
        const folders = await Folder.find();
        res.status(200).json(folders);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

//Get folder by ID
const getFolderById = async (req,res) => {
    try {
        const folder = await Folder.findById(req.params.id);
        if(!folder){
            return res.status(404).json({error:'Folder not found'});
        }
        res.status(200).json(folder);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
};

//Update Folder (color,name)
const updateFolder = async (req,res) => {
    try {
        const { id } = req.params; // Folder ID from URL
    const { name, color } = req.body;

    // Check if folder exists
    const folder = await Folder.findById(id);
    if (!folder) {
      return res.status(404).json({ error: 'Folder not found' });
    }

    // Validate name (Ensure it's unique, excluding the current folder)
    const existingFolder = await Folder.findOne({ name, _id: { $ne: id } });
    if (existingFolder) {
      return res.status(400).json({ error: 'Folder name already exists. Choose a different name.' });
    }

    // Update folder
    folder.name = name || folder.name;
    folder.color = color || folder.color;
    await folder.save();

    res.status(200).json({ message: 'Folder updated successfully', folder });
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
        return res.status(400).json({ error: 'Invalid folder ID' });
      }
  
      // 2️⃣ Check if the folder exists before deleting
      const folder = await Folder.findById(id);
      if (!folder) {
        return res.status(404).json({ error: 'Folder not found' });
      }
  
      // 3️⃣ Remove notes from the folder without deleting the notes themselves
      folder.notes = [];
      await folder.save();
  
      // 4️⃣ Delete the folder (Now we are sure it exists)
      await Folder.findByIdAndDelete(id);
  
      return res.status(200).json({ message: 'Folder deleted successfully' });
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
        const { noteId } = req.body; // Only Note ID (No need for type from frontend)

        // Validate if the folder exists
        const folder = await Folder.findById(id);
        if (!folder) {
            return res.status(404).json({ error: 'Folder not found' });
        }

        let type = null;

        // 🔥 Determine the type automatically
        if (await HandwrittenNote.findById(noteId)) {
            type = 'HandwrittenNote';
        } else if (await StructuredText.findById(noteId)) {
            type = 'StructuredText';
        } else if (await VoiceNote.findById(noteId)) {
            type = 'VoiceNote';
        } else {
            return res.status(404).json({ error: 'Note not found in any collection' });
        }

        // 🔥 Ensure `type` is set before pushing the note
        if (!type) {
            return res.status(400).json({ error: 'Note type could not be determined' });
        }

        // Remove note from another folder if it exists
        const existingFolder = await Folder.findOne({ 'notes.noteId': noteId });
        if (existingFolder) {
            existingFolder.notes = existingFolder.notes.filter(note => note.noteId.toString() !== noteId);
            await existingFolder.save();
        }

        // Add note to the new folder
        folder.notes.push({ noteId, type });
        await folder.save();

        res.status(200).json({ message: 'Note added to folder successfully', folder });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Retrieve notes inside folder
const getNotesInFolder = async (req, res) => {
    try {
        const { id } = req.params; // Folder ID from URL

        // Check if folder exists
        const folder = await Folder.findById(id).populate('notes.noteId');
        if (!folder) {
            return res.status(404).json({ error: 'Folder not found' });
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
            return res.status(404).json({ error: 'Folder not found' });
        }

        // Remove note from folder
        folder.notes = folder.notes.filter(note => note.noteId.toString() !== noteId);
        await folder.save();

        res.status(200).json({ message: 'Note removed from folder successfully', folder });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

//get all notes
const getAllNotes = async (req, res) => {
    try {
        const handwrittenNotes = await HandwrittenNote.find().lean().then(notes => 
            notes.map(note => ({ ...note, noteType: 'HandwrittenNote' }))
        );

        const structuredTextNotes = await StructuredText.find().lean().then(notes => 
            notes.map(note => ({ ...note, noteType: 'StructuredText' }))
        );

        const voiceNotes = await VoiceNote.find().lean().then(notes => 
            notes.map(note => ({ ...note, noteType: 'VoiceNote' }))
        );

        // Merge all notes
        const allNotes = [...handwrittenNotes, ...structuredTextNotes, ...voiceNotes];

        res.json(allNotes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


module.exports = {
    createFolder,
    getFolders,
    getFolderById,
    updateFolder,
    deleteFolder,
    addNoteToFolder,
    getNotesInFolder,
    removeNoteFromFolder
}
