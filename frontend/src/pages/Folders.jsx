import { useState, useEffect } from "react";
import {
  Folder,
  Add,
  Edit,
  Delete,
  Close,
  ArrowBack,
} from "@mui/icons-material";
import {
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
  Select,
  MenuItem,
  Typography,
  Tooltip,
} from "@mui/material";
import {
  getFolders,
  createFolder,
  updateFolder,
  deleteFolder,
  getNotesInFolder,
  getNotes,
  addNoteToFolder,
  removeNoteFromFolder,
  getVoiceNotes,
  getStructuredTexts,
} from "../services/api"; // Import your API functions
import Swal from "sweetalert2";

const predefinedColors = ["red", "blue", "green", "yellow", "purple", "orange"];

const Sidebar = ({
  folders,
  onSelectFolder,
  onAddFolder,
  onEditFolder,
  onDeleteFolder,
}) => {
  const [showFolders, setShowFolders] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedColor, setSelectedColor] = useState("");

  const filteredFolders = folders.filter((folder) => {
    const normalizedSearchQuery = searchQuery.toLowerCase().trim();
    const matchesSearch = folder.name
      .toLowerCase()
      .includes(normalizedSearchQuery);

    const matchesColor = selectedColor ? folder.color === selectedColor : true;

    // You can add additional conditions here if needed
    return matchesSearch && matchesColor;
  });

  return (
    <div className="w-75 h-screen bg-white text-balck p-6 flex flex-col">
      {/* Static Header */}
      <div className="flex justify-between items-center mb-4">
        <Tooltip title="Add New Folder">
          <IconButton
            onClick={onAddFolder}
            className="text-white hover:bg-gray-700 rounded-full"
          >
            <Add className="text-green-400" fontSize="large" />
          </IconButton>
        </Tooltip>
        <Typography
          variant="h6"
          fontWeight="bold"
          className="font-bold tracking-wide text-indigo-600"
        >
          My Folders
        </Typography>
        <Tooltip title={showFolders ? "Hide Folders" : "Show Folders"}>
          <IconButton
            onClick={() => setShowFolders(!showFolders)}
            className="text-white hover:bg-gray-700 rounded-full"
          >
            <Folder className="text-blue-500" fontSize="medium" />
          </IconButton>
        </Tooltip>
      </div>

      {/* Search Input */}
      <TextField
        fullWidth
        variant="outlined"
        placeholder="Search folders..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      {/* Color Filter Dropdown */}
      <Select
        fullWidth
        variant="outlined"
        value={selectedColor}
        onChange={(e) => setSelectedColor(e.target.value)}
        displayEmpty
      >
        <MenuItem value="">
          <em>All Colors</em>
        </MenuItem>
        {predefinedColors.map((color) => (
          <MenuItem key={color} value={color}>
            <div className="flex items-center gap-2">
              <div
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: color }}
              />
              <span>{color}</span>
            </div>
          </MenuItem>
        ))}
      </Select>

      {/* Scrollable Folder List */}
      {showFolders && (
        <div className="flex-1 overflow-y-auto">
          {filteredFolders.map((folder) => (
            <div
              key={folder._id}
              className="p-2 my-1 cursor-pointer bg-gray-100 hover:bg-gray-200 rounded flex items-center justify-between transition-colors duration-150"
              onClick={() => onSelectFolder(folder._id)}
            >
              <div className="flex items-center gap-2">
                <Folder style={{ color: folder.color }} fontSize="small" />
                <span className="truncate">{folder.name}</span>
              </div>
              <div className="flex gap-1">
                <Tooltip title="Edit Folder">
                  <IconButton
                    onClick={(e) => {
                      e.stopPropagation();
                      onEditFolder(folder);
                    }}
                    className="text-white hover:bg-gray-600 p-1"
                  >
                    <Edit fontSize="small" className="text-blue-500" />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Delete Folder">
                  <IconButton
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteFolder(folder._id);
                    }}
                    className="text-white hover:bg-gray-600 p-1"
                  >
                    <Delete fontSize="small" className="text-red-500" />
                  </IconButton>
                </Tooltip>
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
        setAllNotes([
          ...handwrittenNotes.data,
          ...voiceNotes.data,
          ...structuredTexts.data,
        ]); // Combine all notes
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
    if (newFolderName.trim() === "") {
      handleClose();
      Swal.fire({
        title: "Error!",
        text: "Folder name cannot be empty.",
        icon: "error",
        confirmButtonText: "OK",
      });
      return;
    }

    const folderExists = folders.some(
      (folder) => folder.name === newFolderName
    );

    if (folderExists) {
      handleClose();
      Swal.fire({
        title: "Error!",
        text: "Folder name already exists.",
        icon: "error",
        confirmButtonText: "OK",
      });
      return;
    }

    try {
      const newFolder = {
        name: newFolderName,
        color: newFolderColor,
        notes: [],
      };
      const response = await createFolder(newFolder);
      setFolders([...folders, response.data]);
      handleClose();
      Swal.fire({
        title: "Success!",
        text: "Folder created successfully.",
        icon: "success",
        confirmButtonText: "OK",
      });
    } catch (error) {
      console.error("Failed to create folder:", error);
      handleClose();
      Swal.fire({
        title: "Error!",
        text: "Failed to create folder.",
        icon: "error",
        confirmButtonText: "OK",
      });
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

    const folderExists = folders.some(
      (f) =>
        f.name.toLowerCase() === newFolderName.toLowerCase() &&
        f._id !== editingFolder._id
    );

    if (folderExists) {
      handleClose();
      Swal.fire({
        title: "Error!",
        text: "A folder with this name already exists.",
        icon: "error",
        confirmButtonText: "OK",
      });
      return;
    }

    try {
      const updatedFolder = { name: newFolderName, color: newFolderColor };
      const response = await updateFolder(editingFolder._id, updatedFolder);
      const updatedFolders = folders.map((f) =>
        f._id === editingFolder._id ? response.data.folder : f
      );
      setFolders(updatedFolders);
      setEditOpen(false);
      setEditingFolder(null);
      setNewFolderName("");
      setNewFolderColor(predefinedColors[0]);
      Swal.fire({
        title: "Success!",
        text: "Folder updated successfully.",
        icon: "success",
        confirmButtonText: "OK",
      });
    } catch (error) {
      console.error("Failed to update folder:", error);
      Swal.fire({
        title: "Error!",
        text: "Failed to update folder.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  const handleDeleteFolder = async (folderId) => {
    Swal.fire({
      title: "Do you want to delete Folder?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "Cancel",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteFolder(folderId);
          const updatedFolders = folders.filter((f) => f._id !== folderId);
          setFolders(updatedFolders);
          if (selectedFolder === folderId) {
            setSelectedFolder(null);
            setNotes([]);
          }
          Swal.fire("Deleted!", "Your folder has been deleted.", "success");
        } catch (error) {
          console.error("Failed to delete folder:", error);
        }
      }
    });
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
      const note = {
        noteId: selectedNoteId,
        type: allNotes.find((note) => note._id === selectedNoteId).type,
      };
      await addNoteToFolder(selectedFolder, note);
      const response = await getNotesInFolder(selectedFolder);
      setNotes(response.data.notes);
      handleClose();
      Swal.fire({
        title: "Success!",
        text: "Note successfully added to the Folder.",
        icon: "success",
        confirmButtonText: "OK",
      });
    } catch (error) {
      console.error("Failed to add note to folder:", error);
      Swal.fire({
        title: "Error!",
        text: "Failed to add note.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  const handleBack = () => {
    setSelectedFolder(null);
  };

  const handleRemoveNoteFromFolder = async (noteId) => {
    Swal.fire({
      title: "Remove Note?",
      text: "Are you sure you want to remove this note from the folder?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "Cancel",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await removeNoteFromFolder(selectedFolder, noteId);
          const response = await getNotesInFolder(selectedFolder);
          setNotes(response.data.notes);
          Swal.fire(
            "Removed!",
            "The note has been removed from the folder.",
            "success"
          );
        } catch (error) {
          console.error("Failed to remove note from folder:", error);
        }
      }
    });
  };

  return (
    <div className="flex h-screen bg-white">
      <Sidebar
        folders={folders}
        onSelectFolder={handleSelectFolder}
        onAddFolder={handleAddFolder}
        onEditFolder={handleEditFolder}
        onDeleteFolder={handleDeleteFolder}
      />

      <div className="flex-1 p-6 overflow-y-auto">
        {selectedFolder ? (
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center mb-6">
              <Button
                onClick={handleBack}
                className="mr-3 rounded-full p-2 hover:bg-gray-200 transition-colors"
              >
                <ArrowBack className="text-gray-600" />
              </Button>
              <h2 className="text-2xl font-bold text-gray-800 flex-1">
                {folders.find((f) => f._id === selectedFolder)?.name}
              </h2>
            </div>

            {notes.length > 0 ? (
              <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2">
                {notes.map((note, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow border border-gray-100"
                  >
                    <div className="flex justify-between items-start">
                      <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-1">
                        {note.noteId.title || "Untitled Note"}
                      </h3>
                      <IconButton
                        onClick={() =>
                          handleRemoveNoteFromFolder(note.noteId._id)
                        }
                        className="text-gray-400 hover:text-red-500 hover:bg-gray-100 rounded-full p-1 -mt-1 -mr-1 transition-colors"
                      >
                        <Close fontSize="small" />
                      </IconButton>
                    </div>

                    <div className="text-gray-600 text-sm mb-3 line-clamp-3">
                      {note.noteId.content ||
                        note.noteId.transcript ||
                        note.noteId.extractedText ||
                        "No content"}
                    </div>

                    <div className="flex items-center justify-between text-xs text-gray-500 mt-4 pt-2 border-t border-gray-100">
                      <span className="px-2 py-1 bg-gray-100 rounded-full">
                        {note.type}
                      </span>
                      <span>
                        {new Date(note.addedAt).toLocaleDateString(undefined, {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-lg shadow-sm">
                <div className="text-gray-400 mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-16 w-16 mx-auto"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <p className="text-gray-600">No notes in this folder yet</p>
              </div>
            )}

            <div className="fixed bottom-8 right-8">
              <IconButton
                onClick={() => setAddNoteOpen(true)}
                className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white p-4 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                style={{ minWidth: "60px", minHeight: "60px" }}
              >
                <Add fontSize="large" />
              </IconButton>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100 max-w-md">
              <div className="text-blue-500 mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-16 w-16 mx-auto"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M5 19a2 2 0 01-2-2V7a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1M5 19h14a2 2 0 002-2v-5a2 2 0 00-2-2H9a2 2 0 00-2 2v5a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <Typography
                variant="h5"
                className="text-gray-700 mb-2 font-medium"
              >
                Select a folder to view notes
              </Typography>
              <p className="text-gray-500 text-sm">
                Choose a folder from the sidebar or create a new one to get
                started
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Folder Creation Dialog */}
      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{ className: "rounded-lg" }}
      >
        <DialogTitle className="bg-gray-50 border-b border-gray-100">
          <Typography variant="h6" className="font-medium">
            Create New Folder
          </Typography>
        </DialogTitle>
        <DialogContent className="pt-4 mt-2">
          <TextField
            autoFocus
            margin="dense"
            label="Folder Name"
            fullWidth
            variant="outlined"
            value={newFolderName}
            onChange={(e) => setNewFolderName(e.target.value)}
          />
          <div className="mt-6">
            <Typography
              variant="subtitle2"
              className="mb-3 text-gray-700 font-medium"
            >
              Select Folder Color
            </Typography>
            <div className="flex flex-wrap gap-3 mt-2">
              {predefinedColors.map((color) => (
                <button
                  key={color}
                  className={`w-10 h-10 rounded-full border-2 transition-transform ${
                    newFolderColor === color
                      ? "border-gray-900 scale-110"
                      : "border-transparent"
                  }`}
                  style={{ backgroundColor: color }}
                  onClick={() => setNewFolderColor(color)}
                />
              ))}
            </div>
          </div>
        </DialogContent>
        <DialogActions className="p-4 bg-gray-50 border-t border-gray-100">
          <Button onClick={handleClose} className="px-4 py-2 text-gray-700">
            Cancel
          </Button>
          <Button
            onClick={handleCreateFolder}
            className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-md"
          >
            Create
          </Button>
        </DialogActions>
      </Dialog>

      {/* Folder Edit Dialog */}
      <Dialog
        open={editOpen}
        onClose={handleClose}
        PaperProps={{ className: "rounded-lg" }}
      >
        <DialogTitle className="bg-gray-50 border-b border-gray-100">
          <Typography variant="h6" className="font-medium">
            Edit Folder
          </Typography>
        </DialogTitle>
        <DialogContent className="pt-4 mt-2">
          <TextField
            autoFocus
            margin="dense"
            label="Folder Name"
            fullWidth
            variant="outlined"
            value={newFolderName}
            onChange={(e) => setNewFolderName(e.target.value)}
          />
          <div className="mt-6">
            <Typography
              variant="subtitle2"
              className="mb-3 text-gray-700 font-medium"
            >
              Select Folder Color
            </Typography>
            <div className="flex flex-wrap gap-3 mt-2">
              {predefinedColors.map((color) => (
                <button
                  key={color}
                  className={`w-10 h-10 rounded-full border-2 transition-transform ${
                    newFolderColor === color
                      ? "border-gray-900 scale-110"
                      : "border-transparent"
                  }`}
                  style={{ backgroundColor: color }}
                  onClick={() => setNewFolderColor(color)}
                />
              ))}
            </div>
          </div>
        </DialogContent>
        <DialogActions className="p-4 bg-gray-50 border-t border-gray-100">
          <Button onClick={handleClose} className="px-4 py-2 text-gray-700">
            Cancel
          </Button>
          <Button
            onClick={handleUpdateFolder}
            className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-md"
          >
            Update
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add Note to Folder Dialog */}
      <Dialog
        open={addNoteOpen}
        onClose={handleClose}
        maxWidth="sm"
        fullWidth
        PaperProps={{ className: "rounded-lg" }}
      >
        <DialogTitle className="bg-gray-50 border-b border-gray-100">
          <Typography variant="h6" className="font-medium">
            Add Note to Folder
          </Typography>
        </DialogTitle>
        <DialogContent className="pt-4 mt-2">
          <Typography
            variant="subtitle1"
            className="text-gray-700 font-semibold mb-2"
          >
            Folder:{" "}
            {folders.find((f) => f._id === selectedFolder)?.name ||
              "No Folder Selected"}
          </Typography>
          <Select
            fullWidth
            value={selectedNoteId}
            onChange={(e) => setSelectedNoteId(e.target.value)}
            variant="outlined"
            displayEmpty
            className="mt-2"
          >
            <MenuItem value="">
              <em>Select a note to add</em>
            </MenuItem>
            {allNotes.map((note) => (
              <MenuItem key={note._id} value={note._id}>
                <div className="py-1">
                  <div className="font-medium truncate">
                    {note.title || "Untitled Note"}
                  </div>
                  {note.content && (
                    <div className="text-gray-500 text-sm truncate">
                      {note.content.substring(0, 60)}
                      {note.content.length > 60 ? "..." : ""}
                    </div>
                  )}
                </div>
              </MenuItem>
            ))}
          </Select>
        </DialogContent>
        <DialogActions className="p-4 bg-gray-50 border-t border-gray-100">
          <Button onClick={handleClose} className="px-4 py-2 text-gray-700">
            Cancel
          </Button>
          <Button
            onClick={handleAddNoteToFolder}
            disabled={!selectedNoteId}
            className={`px-4 py-2 rounded-md ${
              selectedNoteId
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "bg-gray-200 text-gray-500"
            }`}
          >
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Folders;
