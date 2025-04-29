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
  
    // Fetch folders and notes on component mount
    useEffect(() => {
      const fetchFolders = async () => {
        try {
          const response = await getFolders();
          setFolders(response.data);
        } catch (error) {
          console.error("Failed to fetch folders:", error);
        }
      };
  
      const fetchAllNotes = async () => {
        try {
          const handwrittenNotes = await getNotes();
          const voiceNotes = await getVoiceNotes();
          const structuredTexts = await getStructuredTexts();
          setAllNotes([...handwrittenNotes.data, ...voiceNotes.data, ...structuredTexts.data]);
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
        setFolders([...folders, response.data]);
        handleClose();
  
        // Show success message
        Swal.fire({
          title: 'Success!',
          text: 'Folder created successfully.',
          icon: 'success',
          confirmButtonText: 'OK'
        });
      } catch (error) {
        console.error("Failed to create folder:", error);
  
        // Show error message
        Swal.fire({
          title: 'Error!',
          text: 'Failed to create folder.',
          icon: 'error',
          confirmButtonText: 'OK'
        });
      }
    };
  
    // Other functions (handleEditFolder, handleUpdateFolder, handleDeleteFolder, etc.) remain unchanged
  
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
                      <p className="text-gray-700 mt-1">{note.noteId.content}
                                                        {note.noteId.transcript}
                                                        {note.noteId.extractedText}
                      </p>
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
              <IconButton
                onClick={() => setAddNoteOpen(true)}
                className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white p-4 rounded-full shadow-lg transition-all duration-300 transform hover:scale-110"
                style={{ minWidth: '56px', minHeight: '56px' }}
              >
                <Add fontSize="large" />
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
  
        {/* Other dialogs (Edit Folder, Add Note to Folder) remain unchanged */}
      </div>
    );
  };
  
  export default Folders;