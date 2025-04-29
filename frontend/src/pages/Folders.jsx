import { useState, useEffect } from "react";
import { Folder, Add, Edit, Delete, Close } from "@mui/icons-material";
import { IconButton, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button, Select, MenuItem } from "@mui/material";
import { getFolders, createFolder, updateFolder, deleteFolder, getNotesInFolder, getNotes, addNoteToFolder, removeNoteFromFolder, getVoiceNotes, getStructuredTexts } from "../services/api"; // Import your API functions

const predefinedColors = ['red', 'blue', 'green', 'yellow', 'purple', 'orange'];

const Sidebar = ({ folders, onSelectFolder, onAddFolder, onEditFolder, onDeleteFolder }) => {
  const [showFolders, setShowFolders] = useState(true);

  return (
    <div className="w-64 h-screen bg-gray-800 text-white p-4 flex flex-col">
      {/* Static Header */}
      <div className="flex justify-between items-center mb-4">
        <IconButton onClick={onAddFolder} className="text-white hover:bg-gray-700">
          <Add className="text-white" fontSize="medeium" />
        </IconButton>
        <IconButton onClick={() => setShowFolders(!showFolders)} className="text-white hover:bg-gray-700">
          <Folder className="text-blue-500" fontSize="medeium" />
        </IconButton>
      </div>

      {/* Scrollable Folder List */}
      {showFolders && (
        <div className="flex-1 overflow-y-auto">
          {folders.map((folder) => (
            <div
              key={folder._id}
              className="p-2 cursor-pointer hover:bg-gray-700 rounded flex items-center justify-between"
              onClick={() => onSelectFolder(folder._id)}
            >
              <div className="flex items-center gap-2">
                <Folder style={{ color: folder.color }} fontSize="small"/>
                <span>{folder.name}</span>
              </div>
              <div className="flex gap-1">
                <IconButton
                  onClick={(e) => {
                    e.stopPropagation();
                    onEditFolder(folder);
                  }}
                  className="text-white hover:bg-gray-600 p-1"
                >
                  <Edit fontSize="small" className="text-blue-500" />
                </IconButton>
                <IconButton
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteFolder(folder._id);
                  }}
                  className="text-white hover:bg-gray-600 p-1"
                >
                  <Delete fontSize="small" className="text-red-500" />
                </IconButton>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const Folders = () => {
  const [folders, setFolders] = useState([]);
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [notes, setNotes] = useState([]);
  const [allNotes, setAllNotes] = useState([]);
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [addNoteOpen, setAddNoteOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [newFolderColor, setNewFolderColor] = useState(predefinedColors[0]);
  const [editingFolder, setEditingFolder] = useState(null);
  const [selectedNoteId, setSelectedNoteId] = useState("");

  // Fetch folders and notes from the database on component mount
  useEffect(() => {
    const fetchFolders = async () => {
      try {
        const response = await getFolders();
        setFolders(response.data); // Assuming the API returns an array of folders
      } catch (error) {
        console.error("Failed to fetch folders:", error);
      }
    };

    const fetchAllNotes = async () => {
      try {
        const handwrittenNotes = await getNotes();
        const voiceNotes = await getVoiceNotes();
        const structuredTexts = await getStructuredTexts();
        setAllNotes([...handwrittenNotes.data, ...voiceNotes.data, ...structuredTexts.data]); // Combine all notes
      } catch (error) {
        console.error("Failed to fetch notes:", error);
      }
    };

    fetchFolders();
    fetchAllNotes();
  }, []);

  const handleAddFolder = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditOpen(false);
    setAddNoteOpen(false);
    setNewFolderName("");
    setNewFolderColor(predefinedColors[0]);
    setSelectedNoteId("");
  };

  const handleCreateFolder = async () => {
    if (newFolderName.trim() === "") return;
    try {
      const newFolder = { name: newFolderName, color: newFolderColor, notes: [] };
      const response = await createFolder(newFolder);
      setFolders([...folders, response.data]); // Assuming the API returns the created folder
      handleClose();
    } catch (error) {
      console.error("Failed to create folder:", error);
    }
  };

  const handleEditFolder = (folder) => {
    setEditingFolder(folder);
    setNewFolderName(folder.name);
    setNewFolderColor(folder.color);
    setEditOpen(true);
  };

  const handleUpdateFolder = async () => {
    if (newFolderName.trim() === "") return;
    try {
      const updatedFolder = { name: newFolderName, color: newFolderColor };
      const response = await updateFolder(editingFolder._id, updatedFolder);
      const updatedFolders = folders.map(f => 
        f._id === editingFolder._id ? response.data.folder : f // Assuming the API returns the updated folder
      );
      setFolders(updatedFolders);
      setEditOpen(false);
      setEditingFolder(null);
      setNewFolderName("");
      setNewFolderColor(predefinedColors[0]);
    } catch (error) {
      console.error("Failed to update folder:", error);
    }
  };

  const handleDeleteFolder = async (folderId) => {
    try {
      await deleteFolder(folderId);
      const updatedFolders = folders.filter(f => f._id !== folderId);
      setFolders(updatedFolders);
      if (selectedFolder === folderId) {
        setSelectedFolder(null);
        setNotes([]);
      }
    } catch (error) {
      console.error("Failed to delete folder:", error);
    }
  };

  const handleSelectFolder = async (folderId) => {
    setSelectedFolder(folderId);
    try {
      const response = await getNotesInFolder(folderId);
      setNotes(response.data.notes);
    } catch (error) {
      console.error("Failed to fetch notes:", error);
    }
  };

  const handleAddNoteToFolder = async () => {
    if (!selectedNoteId) return;
    try {
      const note = { noteId: selectedNoteId, type: allNotes.find(note => note._id === selectedNoteId).type };
      await addNoteToFolder(selectedFolder, note);
      const response = await getNotesInFolder(selectedFolder);
      setNotes(response.data.notes);
      handleClose();
    } catch (error) {
      console.error("Failed to add note to folder:", error);
    }
  };

  const handleRemoveNoteFromFolder = async (noteId) => {
    try {
      await removeNoteFromFolder(selectedFolder, noteId);
      const response = await getNotesInFolder(selectedFolder);
      setNotes(response.data.notes);
    } catch (error) {
      console.error("Failed to remove note from folder:", error);
    }
  };

  return (
    <div className="flex h-screen">
      <Sidebar 
        folders={folders} 
        onSelectFolder={handleSelectFolder} 
        onAddFolder={handleAddFolder} 
        onEditFolder={handleEditFolder} 
        onDeleteFolder={handleDeleteFolder} 
      />
      <div className="flex-1 p-6">
        {selectedFolder ? (
          <div>
            <h2 className="text-xl font-bold">{folders.find(f => f._id === selectedFolder)?.name}</h2>
            <ul className="mt-2">
              {notes.map((note, index) => (
                <li key={index} className="p-4 bg-gray-100 rounded my-2 shadow-md flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-semibold">{note.noteId.title}</h3>
                    <p className="text-gray-700 mt-1">{note.noteId.content}</p>
                    <p className="text-gray-500 text-sm mt-1">Type: {note.type}</p>
                    <p className="text-gray-500 text-sm mt-1">Added on: {new Date(note.addedAt).toLocaleDateString()}</p>
                  </div>
                  <IconButton
                    onClick={() => handleRemoveNoteFromFolder(note.noteId._id)}
                    className="text-red-500 hover:bg-gray-200 p-1"
                  >
                    <Close fontSize="small" className="text-red-500" />
                  </IconButton>
                </li>
              ))}
            </ul>
            {/* <Button variant="contained" color="primary" onClick={() => setAddNoteOpen(true)}>
              Add Note to Folder
            </Button> */}
            <IconButton
  onClick={() => setAddNoteOpen(true)}
  className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white p-4 rounded-full shadow-lg transition-all duration-300 transform hover:scale-110"
  style={{ minWidth: '56px', minHeight: '56px' }} // Larger size for better visibility
>
  <Add fontSize="large" /> {/* Larger icon */}
</IconButton>
          </div>
        ) : (
          <p>Select a folder to view notes</p>
        )}
      </div>
      
      {/* Folder Creation Dialog */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Create New Folder</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Folder Name"
            fullWidth
            value={newFolderName}
            onChange={(e) => setNewFolderName(e.target.value)}
          />
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700">Select Folder Color</label>
            <div className="flex gap-2 mt-2">
              {predefinedColors.map((color) => (
                <button
                  key={color}
                  className={`w-8 h-8 rounded-full border-2 ${newFolderColor === color ? 'border-black' : 'border-transparent'}`}
                  style={{ backgroundColor: color }}
                  onClick={() => setNewFolderColor(color)}
                />
              ))}
            </div>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleCreateFolder} color="primary">Create</Button>
        </DialogActions>
      </Dialog>

      {/* Folder Edit Dialog */}
      <Dialog open={editOpen} onClose={handleClose}>
        <DialogTitle>Edit Folder</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Folder Name"
            fullWidth
            value={newFolderName}
            onChange={(e) => setNewFolderName(e.target.value)}
          />
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700">Select Folder Color</label>
            <div className="flex gap-2 mt-2">
              {predefinedColors.map((color) => (
                <button
                  key={color}
                  className={`w-8 h-8 rounded-full border-2 ${newFolderColor === color ? 'border-black' : 'border-transparent'}`}
                  style={{ backgroundColor: color }}
                  onClick={() => setNewFolderColor(color)}
                />
              ))}
            </div>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleUpdateFolder} color="primary">Update</Button>
        </DialogActions>
      </Dialog>

      {/* Add Note to Folder Dialog */}
      <Dialog open={addNoteOpen} onClose={handleClose}>
        <DialogTitle>Add Note to Folder</DialogTitle>
        <DialogContent>
          <Select
            fullWidth
            value={selectedNoteId}
            onChange={(e) => setSelectedNoteId(e.target.value)}
          >
            <MenuItem value="">
              <em>Select Note</em>
            </MenuItem>
            {allNotes.map((note) => (
              <MenuItem key={note._id} value={note._id}>
                {note.title || note.content}
              </MenuItem>
            ))}
          </Select>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleAddNoteToFolder} color="primary">Add</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Folders;