import React, { useEffect, useState } from 'react';
import { getNotes, createNote, updateNote, deleteNote } from '../services/api';


const HandwrittenNotes = () => {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState({ title: '', content: '' });
  const [editableNote, setEditableNote] = useState({ id: null, title: '', content: '' });
  const [searchTerm, setSearchTerm] = useState(''); // State for search term
  const [searchType, setSearchType] = useState('title'); // Default to 'title'
  

  // Fetch all notes
  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    const response = await getNotes();
    setNotes(response.data);
  };

  // Create a new note
  const handleCreate = async () => {
    await createNote(newNote);
    setNewNote({ title: '', content: '' });
    fetchNotes();
  };

  // Set a note to editable mode
  const handleEdit = (note) => {
    setEditableNote({ id: note._id, title: note.title, content: note.content });
  };

  // Update a note
  const handleUpdate = async () => {
    if (editableNote.id) {
      await updateNote(editableNote.id, { title: editableNote.title, content: editableNote.content });
      setEditableNote({ id: null, title: '', content: '' }); // Reset editable state
      fetchNotes(); // Refresh the notes list
    }
  };

  // Delete a note
  const handleDelete = async (id) => {
    await deleteNote(id);
    fetchNotes();
  };

  // Filter notes based on search term
  const filteredNotes = notes.filter((note) => {
    const searchTermLower = searchTerm.toLowerCase();
    if (searchType === 'title') {
      return note.title.toLowerCase().includes(searchTermLower);
    } else if (searchType === 'content') {
      return note.content.toLowerCase().includes(searchTermLower);
    }
    return true; // Show all notes if no type is selected
  });

  return (
    <div className="app-container">
      <h1>Handwritten Notes</h1>

      {/* Search Bar */}
      <div className="search-container">
      {/* Dropdown for search type */}
      <select
        className="search-dropdown"
        value={searchType}
        onChange={(e) => setSearchType(e.target.value)}
      >
        <option value="title">Title</option>
        <option value="content">Content</option>
      </select>

      {/* Search input */}
      <input
        type="text"
        placeholder={`Search by ${searchType}...`}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-input"
      />
    </div>

      {/* Create a New Note */}
      <div className="create-note">
        <h2>Create a New Note</h2>
        <input
          type="text"
          placeholder="Title"
          value={newNote.title}
          onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
        />
        <textarea
          placeholder="Content"
          value={newNote.content}
          onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
        />
        <button className="cta-button" onClick={handleCreate}>
          Create Note
        </button>
      </div>

      {/* Display Notes */}
      <div className="notes-section">
        <h2>Your Notes</h2>
        {filteredNotes.map((note) => (
          <div key={note._id} className="note-card">
            {/* Display note in editable mode if it matches the editableNote ID */}
            {editableNote.id === note._id ? (
              <div className="edit-mode">
                <input
                  type="text"
                  value={editableNote.title}
                  onChange={(e) => setEditableNote({ ...editableNote, title: e.target.value })}
                />
                <textarea
                  value={editableNote.content}
                  onChange={(e) => setEditableNote({ ...editableNote, content: e.target.value })}
                />
                <button className="cta-button" onClick={handleUpdate}>
                  Save
                </button>
                <button
                  className="cta-button"
                  onClick={() => setEditableNote({ id: null, title: '', content: '' })}
                >
                  Cancel
                </button>
              </div>
            ) : (
              // Display note in read-only mode
              <div>
                <h3>{note.title}</h3>
                <p>{note.content}</p>
                <div className="note-actions">
                  <button className="cta-button" onClick={() => handleEdit(note)}>
                    Edit
                  </button>
                  <button className="cta-button" onClick={() => handleDelete(note._id)}>
                    Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default HandwrittenNotes;