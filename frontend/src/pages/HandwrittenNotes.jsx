import React, { useEffect, useState } from "react";
import {
  getNotesuser,
  createNote,
  updateNote,
  deleteNote,
  getNoteHistory,
  revertNote,
  deleteVersion,
  getTagsByUser,
  createTag,
  updateTag,
  deleteTag,
} from "../services/api";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import jsPDF from "jspdf";

// ModernButton Component
const ModernButton = ({ children, borderColor = "indigo-500", onClick, disabled = false }) => {
  const baseClasses = "border-2 text-black font-semibold py-2 px-4 rounded-lg transition-colors duration-200";
  const borderClasses = {
    "indigo-500": "border-indigo-500 hover:border-indigo-600",
    "blue-500": "border-blue-500 hover:border-blue-600",
    "teal-500": "border-teal-500 hover:border-teal-600",
    "blue-600": "border-blue-600 hover:border-blue-700",
  };

  const buttonClasses = `${baseClasses} ${borderClasses[borderColor]} ${disabled ? "opacity-50 cursor-not-allowed" : ""}`;

  return (
    <button className={buttonClasses} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
};

const HandwrittenNotes = () => {
  const userInfo = useSelector((state) => state.auth.userInfo);
  const navigate = useNavigate();
  const userId = userInfo?._id;

  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState({ title: "", content: "", userId: "", tags: [] });
  const [editableNote, setEditableNote] = useState({ id: null, title: "", content: "", tags: [] });
  const [searchTerm, setSearchTerm] = useState("");
  const [searchType, setSearchType] = useState("title");
  const [selectedNoteHistory, setSelectedNoteHistory] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tags, setTags] = useState([]);
  const [showTagSelectionDropdown, setShowTagSelectionDropdown] = useState(false);
  const [showEditTagSelectionDropdown, setShowEditTagSelectionDropdown] = useState(false);
  const [filterTag, setFilterTag] = useState(null);

  // Handle delayed dropdown closure
  let timeoutId = null;
  const handleMouseLeave = () => {
    timeoutId = setTimeout(() => {
      setShowTagSelectionDropdown(false);
    }, 300);
  };
  const handleMouseEnter = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
    setShowTagSelectionDropdown(true);
  };

  // TagCreation Component
  const TagCreation = () => {
    const handleCreateTag = async () => {
      try {
        const { value: newTag } = await Swal.fire({
          title: "Create New Tag",
          input: "text",
          inputPlaceholder: "Enter tag name",
          showCancelButton: true,
          confirmButtonText: "Add Tag",
          cancelButtonText: "Cancel",
          inputValidator: (value) => !value || value.trim() === "" ? "Tag name cannot be empty!" : null,
          customClass: {
            confirmButton: "bg-teal-500 text-white font-semibold py-2 px-4 rounded-lg mr-2",
            cancelButton: "bg-gray-300 text-black font-semibold py-2 px-4 rounded-lg",
          },
          buttonsStyling: false,
        });

        if (newTag) {
          const response = await createTag({ name: newTag, userId });
          setTags((prevTags) => [...prevTags, response.data]);
          toast.success(`Tag "${newTag}" created successfully!`);
        }
      } catch (err) {
        toast.error(err.response?.data?.message || "Failed to create tag.");
      }
    };

    return (
      <div className="relative group flex items-center">
        <button
          className="inline-flex items-center justify-center whitespace-nowrap transition-colors focus-visible:outline-none bg-transparent text-gray-900 border border-indigo-500 hover:border-indigo-600 rounded-full p-3 size-10 group hover:w-auto gap-1"
          onClick={handleCreateTag}
          type="button"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14" className="size-4 fill-current">
            <g clipPath="url(#plus_svg__a)">
              <path
                fill="currentColor"
                d="M6.125 11.667a.875.875 0 1 0 1.75 0V7.875h3.792a.875.875 0 0 0 0-1.75H7.875V2.333a.875.875 0 0 0-1.75 0v3.792H2.333a.875.875 0 0 0 0 1.75h3.792z"
              />
            </g>
            <defs>
              <clipPath id="plus_svg__a">
                <path fill="#fff" d="M0 0h14v14H0z" />
              </clipPath>
            </defs>
          </svg>
        </button>
        <p className="hidden group-hover:block font-medium text-gray-900 ml-2">Add Tag</p>
      </div>
    );
  };

  // TagMenu Component
  const TagMenu = ({ tag }) => {
    const [showMenu, setShowMenu] = useState(false);
    const [isClicked, setIsClicked] = useState(false);

    const handleEditTag = async () => {
      try {
        const { value: updatedTagName } = await Swal.fire({
          title: "Edit Tag",
          input: "text",
          inputValue: tag.name,
          inputPlaceholder: "Enter new tag name",
          showCancelButton: true,
          confirmButtonText: "Save",
          cancelButtonText: "Cancel",
          inputValidator: (value) => !value || value.trim() === "" ? "Tag name cannot be empty!" : null,
          customClass: {
            confirmButton: "bg-indigo-500 text-white font-semibold py-2 px-4 rounded-lg mr-2",
            cancelButton: "bg-gray-300 text-black font-semibold py-2 px-4 rounded-lg",
          },
          buttonsStyling: false,
        });

        if (updatedTagName) {
          const updatedTag = await updateTag(tag._id, { name: updatedTagName, userId });
          console.log("Updated tag response:", updatedTag);
          setTags((prevTags) =>
            prevTags.map((t) =>
              t._id === tag._id ? { ...t, name: updatedTagName, userId } : t
            )
          );
          toast.success(`Tag "${updatedTagName}" updated successfully!`);
        }
      } catch (err) {
        console.error("Error updating tag:", err.response?.data || err.message);
        toast.error(err.response?.data?.message || "Failed to update tag.");
      }
      setShowMenu(false);
      setIsClicked(false);
    };

    const handleDeleteTag = async () => {
      try {
        const result = await Swal.fire({
          title: "Delete Tag",
          text: `Are you sure you want to delete the tag "${tag.name}"?`,
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "Delete",
          cancelButtonText: "Cancel",
          customClass: {
            confirmButton: "bg-red-500 text-white font-semibold py-2 px-4 rounded-lg mr-2",
            cancelButton: "bg-gray-300 text-black font-semibold py-2 px-4 rounded-lg",
          },
          buttonsStyling: false,
        });

        if (result.isConfirmed) {
          await deleteTag(tag._id);
          setTags((prevTags) => prevTags.filter((t) => t._id !== tag._id));
          if (filterTag === tag._id) setFilterTag(null);
          toast.success(`Tag "${tag.name}" deleted successfully!`);
        }
      } catch (err) {
        toast.error(err.response?.data?.message || "Failed to delete tag.");
      }
      setShowMenu(false);
      setIsClicked(false);
    };

    const handleToggleMenu = (e) => {
      e.stopPropagation();
      setShowMenu((prev) => !prev);
      setIsClicked((prev) => !prev);
    };

    return (
      <div
        className="relative inline-block"
        onMouseEnter={() => !isClicked && setShowMenu(true)}
        onMouseLeave={() => !isClicked && setShowMenu(false)}
      >
        <ModernButton borderColor={filterTag === tag._id ? "indigo-500" : "blue-500"} onClick={() => setFilterTag(tag._id)}>
          #{tag.name}
          <span className="ml-2 cursor-pointer hover:text-gray-700" onClick={handleToggleMenu}>
            ⋮
          </span>
        </ModernButton>
        {showMenu && (
          <div className="absolute right-0 mt-0 bg-white border border-gray-200 shadow-lg rounded-lg z-10 transition-opacity duration-200">
            <button className="block text-left px-4 py-1 text-gray-700 hover:bg-gray-100 rounded-t-lg whitespace-nowrap" onClick={handleEditTag}>
              Edit Tag
            </button>
            <button className="block text-left px-4 py-1 text-gray-700 hover:bg-gray-100 whitespace-nowrap" onClick={handleDeleteTag}>
              Delete Tag
            </button>
            <button
              className="block text-left px-4 py-1 text-gray-700 hover:bg-gray-100 rounded-b-lg whitespace-nowrap"
              onClick={() => {
                generatePDF(tag);
                setShowMenu(false);
                setIsClicked(false);
              }}
            >
              Generate PDF
            </button>
          </div>
        )}
      </div>
    );
  };

  useEffect(() => {
    if (!userInfo) {
      navigate("/login");
    }
  }, [userInfo, navigate]);

  useEffect(() => {
    if (userId) {
      fetchNotes();
      fetchTags();
    }
  }, [userId]);

  useEffect(() => {
    setNewNote((prev) => ({ ...prev, userId }));
  }, [userId]);

  const fetchNotes = async () => {
    try {
      setLoading(true);
      if (!userId) throw new Error("User ID is missing.");
      const response = await getNotesuser(userId);
      console.log("Fetched notes:", response.data);
      setNotes(response.data || []);
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to fetch notes.");
      setNotes([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchTags = async () => {
    try {
      if (!userId) throw new Error("User ID is missing.");
      const response = await getTagsByUser(userId);
      console.log("Fetched tags:", response.data);
      setTags(response.data || []);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to fetch tags.");
      setTags([]);
    }
  };

  const handleCreate = async () => {
    try {
      if (!userId) throw new Error("User not authenticated.");
      if (!newNote.title.trim() || !newNote.content.trim()) throw new Error("Title and content cannot be empty!");
      await createNote({ ...newNote, userId });
      setNewNote({ title: "", content: "", userId, tags: [] });
      setShowTagSelectionDropdown(false);
      fetchNotes();
      toast.success("Note created successfully!");
    } catch (err) {
      toast.error(err.response?.data?.error || err.message || "Failed to create note.");
    }
  };

  const toggleTagSelection = (tagId, isEditMode = false) => {
    console.log("Toggling tag:", tagId);
    if (isEditMode) {
      setEditableNote((prev) => {
        const newTags = prev.tags.includes(tagId) ? prev.tags.filter((id) => id !== tagId) : [...prev.tags, tagId];
        console.log("Updated editableNote.tags:", newTags);
        return { ...prev, tags: newTags };
      });
    } else {
      setNewNote((prev) => {
        const newTags = prev.tags.includes(tagId) ? prev.tags.filter((id) => id !== tagId) : [...prev.tags, tagId];
        console.log("Updated newNote.tags:", newTags);
        return { ...prev, tags: newTags };
      });
    }
  };

  const handleEdit = (note) => {
    const tags = (note.tags || []).map((tag) => (typeof tag === "object" ? tag._id : tag)).filter(Boolean);
    console.log("Initializing editableNote.tags:", tags);
    setEditableNote({
      id: note._id,
      title: note.title,
      content: note.content,
      tags,
    });
  };

  const handleUpdate = async () => {
    if (!editableNote.id) return;
    try {
      if (!userId) throw new Error("User not authenticated.");
      if (!Array.isArray(editableNote.tags)) throw new Error("Tags must be an array");
      const payload = { title: editableNote.title, content: editableNote.content, userId, tags: editableNote.tags };
      console.log("Updating note with payload:", payload);
      const response = await updateNote(editableNote.id, payload);
      console.log("Update note response:", response.data);
      setEditableNote({ id: null, title: "", content: "", tags: [] });
      setShowEditTagSelectionDropdown(false);
      await fetchNotes();
      await fetchTags();
      toast.success("Note updated successfully!");
    } catch (err) {
      console.error("Error updating note:", err.response?.data || err.message);
      toast.error(err.response?.data?.error || err.message || "Failed to update note.");
    }
  };

  const handleDelete = async (id) => {
    try {
      if (!userId) throw new Error("User not authenticated.");
      await deleteNote(id, { userId });
      fetchNotes();
      toast.success("Note deleted successfully!");
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to delete note.");
    }
  };

  const handleShowHistory = async (noteId) => {
    try {
      const response = await getNoteHistory(noteId);
      setHistory(Array.isArray(response.data) ? response.data : []);
      setSelectedNoteHistory(noteId);
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to fetch note history.");
      setHistory([]);
      setSelectedNoteHistory(noteId);
    }
  };

  const handleRevert = async (noteId, versionId) => {
    try {
      await revertNote(noteId, versionId);
      fetchNotes();
      handleShowHistory(noteId);
      toast.success("Note reverted successfully!");
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to revert note.");
    }
  };

  const handleDeleteVersion = async (noteId, versionId) => {
    try {
      await deleteVersion(noteId, versionId);
      handleShowHistory(noteId);
      toast.success("Version deleted successfully!");
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to delete version.");
    }
  };

  const generatePDF = (tag) => {
    const doc = new jsPDF();
    let yOffset = 20;

    // Sanitize tag name to prevent special characters from breaking PDF
    const safeTagName = tag.name.replace(/[^a-zA-Z0-9-_]/g, "_");

    doc.setFontSize(18);
    doc.text(`Notes for Tag: ${tag.name}`, 20, yOffset);
    yOffset += 10;

    const filteredNotes = notes.filter((note) => note.tags?.some((t) => (typeof t === "object" ? t._id : t) === tag._id));

    if (filteredNotes.length === 0) {
      doc.setFontSize(12);
      doc.text("No notes found for this tag.", 20, yOffset);
      doc.save(`Notes_${safeTagName}.pdf`);
      return;
    }

    filteredNotes.forEach((note, index) => {
      doc.setFontSize(14);
      doc.text(`Note ${index + 1}: ${note.title}`, 20, yOffset);
      yOffset += 10;

      doc.setFontSize(12);
      const contentLines = doc.splitTextToSize(note.content, 170);
      doc.text(contentLines, 20, yOffset);
      yOffset += contentLines.length * 7 + 5;

      const tagNames = note.tags
        ?.map((t) => {
          const tagId = typeof t === "object" ? t._id : t;
          const tagObj = tags.find((tag) => tag._id === tagId);
          return tagObj?.name || "";
        })
        .filter(Boolean)
        .join(", ") || "None";
      doc.text(`Tags: ${tagNames}`, 20, yOffset);
      yOffset += 10;

      if (yOffset > 270) {
        doc.addPage();
        yOffset = 20;
      }
    });

    doc.setFontSize(10);
    const date = new Date().toLocaleDateString();
    doc.text(`Generated on: ${date}`, 20, 280);

    doc.save(`Notes_${safeTagName}.pdf`);
    toast.success(`PDF for tag "${tag.name}" generated successfully!`);
  };

  const filteredNotes = notes.filter((note) => {
    const searchTermLower = searchTerm.toLowerCase();
    const matchesSearch =
      searchType === "title" ? note.title.toLowerCase().includes(searchTermLower) : note.content.toLowerCase().includes(searchTermLower);
    const matchesTag = filterTag ? note.tags?.some((tag) => (typeof tag === "object" ? tag._id : tag) === filterTag) : true;
    return matchesSearch && matchesTag;
  });

  if (!userId) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>You must be logged in to view your notes.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="light" />
      <h1 className="text-3xl font-bold text-center mb-8 text-indigo-700">Handwritten Notes</h1>

      {loading && (
        <div className="flex justify-center mb-6">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      )}

      <div className="mb-6 bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">Filter by Tags</h2>
        <div className="flex flex-wrap gap-2 items-center">
          <TagCreation />
          <ModernButton borderColor={!filterTag ? "indigo-500" : "blue-500"} onClick={() => setFilterTag(null)}>
            All Notes
          </ModernButton>
          {tags.map((tag) => (
            <TagMenu key={tag._id} tag={tag} />
          ))}
        </div>
      </div>

      <div className="mb-6 bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">Search Notes</h2>
        <div className="flex gap-2">
          <select
            className="bg-gray-50 border border-gray-300 text-gray-900 rounded-md focus:ring-indigo-500 focus:border-indigo-500 p-2 w-32"
            value={searchType}
            onChange={(e) => setSearchType(e.target.value)}
          >
            <option value="title">Title</option>
            <option value="content">Content</option>
          </select>
          <input
            type="text"
            placeholder={`Search by ${searchType}...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-gray-50 border border-gray-300 text-gray-900 rounded-md focus:ring-indigo-500 focus:border-indigo-500 p-2 flex-1"
          />
        </div>
      </div>

      <div className="mb-8 bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">Create a New Note</h2>
        <input
          type="text"
          placeholder="Title"
          value={newNote.title}
          onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
          className="w-full mb-4 p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
        />
        <textarea
          placeholder="Content"
          value={newNote.content}
          onChange={(e) => {
            console.log("Textarea input:", e.target.value);
            setNewNote({ ...newNote, content: e.target.value });
            console.log("Updated newNote.content:", newNote.content);
          }}
          onFocus={() => console.log("Textarea focused")}
          className="w-full mb-4 p-2 border border-gray-300 rounded-md h-32 resize-y focus:ring-indigo-500 focus:border-indigo-500"
        />
        <div className="mb-4 relative">
          <div
            className="relative inline-block"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <button
              className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md mb-2 hover:bg-gray-300 transition-colors duration-200"
            >
              {newNote.tags.length > 0 ? `${newNote.tags.length} Tags Selected` : "Select Tags"}
            </button>
            {showTagSelectionDropdown && (
              <div
                className="absolute top-full left-0 mt-2 bg-white p-4 shadow-lg rounded-lg border border-gray-200 z-20 w-64"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                {tags.length === 0 ? (
                  <p className="text-gray-500">No tags created yet</p>
                ) : (
                  tags.map((tag) => (
                    <div
                      key={tag._id}
                      className="flex items-center mb-2 cursor-pointer hover:bg-gray-100 px-2 py-1 rounded"
                      onClick={() => {
                        console.log("Clicked tag:", tag._id);
                        toggleTagSelection(tag._id);
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={newNote.tags.includes(tag._id)}
                        readOnly
                        className="mr-2"
                      />
                      <span className="text-gray-700">{tag.name}</span>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {newNote.tags.map((tagId) => {
              const tag = tags.find((t) => t._id === tagId);
              return tag ? (
                <span key={tagId} className="bg-indigo-100 text-indigo-800 px-2 py-1 rounded-lg text-sm">
                  #{tag.name}
                </span>
              ) : null;
            })}
          </div>
        </div>
        <button
          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors duration-300"
          onClick={handleCreate}
          disabled={!newNote.title || !newNote.content}
        >
          Create Note
        </button>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-6 text-gray-800">Your Notes</h2>
        {loading ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : filteredNotes.length === 0 ? (
          <div className="bg-gray-50 p-6 rounded-md text-center">
            <p className="text-gray-600">No notes available. Create a new note to get started!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredNotes.map((note) => (
              <div key={note._id} className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
                {editableNote.id === note._id ? (
                  <div className="p-4">
                    <input
                      type="text"
                      value={editableNote.title}
                      onChange={(e) => setEditableNote({ ...editableNote, title: e.target.value })}
                      className="w-full mb-4 p-2 border border-gray-300 rounded-md"
                    />
                    <textarea
                      value={editableNote.content}
                      onChange={(e) => setEditableNote({ ...editableNote, content: e.target.value })}
                      className="w-full mb-4 p-2 border border-gray-300 rounded-md h-32"
                    />
                    <div className="mb-4 relative">
                      <button
                        className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md mb-2"
                        onClick={() => setShowEditTagSelectionDropdown(!showEditTagSelectionDropdown)}
                      >
                        {editableNote.tags.length > 0 ? `${editableNote.tags.length} Tags Selected` : "Select Tags"}
                      </button>
                      {showEditTagSelectionDropdown && (
                        <div className="absolute bg-white p-4 shadow-lg rounded-lg border border-gray-200 z-10 w-64">
                          {tags.length === 0 ? (
                            <p className="text-gray-500">No tags created yet</p>
                          ) : (
                            tags.map((tag) => (
                              <div key={tag._id} className="flex items-center mb-2 cursor-pointer" onClick={() => toggleTagSelection(tag._id, true)}>
                                <input type="checkbox" checked={editableNote.tags.includes(tag._id)} readOnly className="mr-2" />
                                <span className="text-gray-700">{tag.name}</span>
                              </div>
                            ))
                          )}
                        </div>
                      )}
                      <div className="flex flex-wrap gap-2 mt-2">
                        {editableNote.tags.map((tagId) => {
                          const tag = tags.find((t) => t._id === tagId);
                          return tag ? (
                            <span key={tagId} className="bg-indigo-100 text-indigo-800 px-2 py-1 rounded-lg text-sm">
                              #{tag.name}
                            </span>
                          ) : null;
                        })}
                      </div>
                    </div>
                    <div className="flex justify-end gap-2">
                      <button
                        className="bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-700 transition-colors duration-300"
                        onClick={handleUpdate}
                      >
                        Save
                      </button>
                      <button
                        className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600 transition-colors duration-300"
                        onClick={() => {
                          setEditableNote({ id: null, title: "", content: "", tags: [] });
                          setShowEditTagSelectionDropdown(false);
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="p-4 border-b">
                      <h3 className="text-xl font-semibold text-gray-800 mb-2">{note.title}</h3>
                      <p className="text-gray-600 whitespace-pre-wrap">{note.content}</p>
                      {note.tags?.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-3">
                          {note.tags.map((tag) => {
                            const tagId = typeof tag === "object" ? tag._id : tag;
                            const tagObj = tags.find((t) => t._id === tagId);
                            return tagObj ? (
                              <span key={tagObj._id} className="bg-indigo-100 text-indigo-800 px-2 py-1 rounded-lg text-sm">
                                #{tagObj.name}
                              </span>
                            ) : null;
                          })}
                        </div>
                      )}
                    </div>
                    <div className="bg-gray-50 p-3 flex flex-wrap gap-2 justify-end">
                      <button
                        className="bg-indigo-600 text-white px-3 py-1 text-sm rounded hover:bg-indigo-700 transition-colors duration-300"
                        onClick={() => handleEdit(note)}
                      >
                        Edit
                      </button>
                      <button
                        className="bg-red-600 text-white px-3 py-1 text-sm rounded hover:bg-red-700 transition-colors duration-300"
                        onClick={() => handleDelete(note._id)}
                      >
                        Delete
                      </button>
                      <button
                        className="bg-gray-600 text-white px-3 py-1 text-sm rounded hover:bg-gray-700 transition-colors duration-300"
                        onClick={() => handleShowHistory(note._id)}
                      >
                        History
                      </button>
                    </div>
                  </div>
                )}
                {selectedNoteHistory === note._id && (
                  <div className="bg-gray-50 p-4 border-t border-gray-200">
                    <h4 className="text-lg font-semibold mb-3 text-gray-700">Note History</h4>
                    {history.length === 0 ? (
                      <p className="text-gray-500">No history available. Edit the note to create history.</p>
                    ) : (
                      <div className="space-y-4">
                        {history.map((version) => (
                          <div key={version._id} className="bg-white p-3 rounded border border-gray-200">
                            <p className="mb-1">
                              <span className="font-medium">Title:</span> {version.title || "Untitled"}
                            </p>
                            <p className="mb-1">
                              <span className="font-medium">Content:</span> {version.content || "No content"}
                            </p>
                            <p className="mb-1">
                              <span className="font-medium">Tags:</span>{" "}
                              {version.tags
                                ?.map((tagId) => {
                                  const tag = tags.find((t) => t._id === tagId);
                                  return tag ? tag.name : "Unknown";
                                })
                                .join(", ") || "None"}
                            </p>
                            <p className="mb-2 text-sm text-gray-500">
                              <span className="font-medium">Modified:</span> {new Date(version.modifiedAt).toLocaleString()}
                            </p>
                            <div className="flex gap-2">
                              <button
                                className="bg-indigo-600 text-white px-2 py-1 text-sm rounded hover:bg-indigo-700 transition-colors duration-300"
                                onClick={() => handleRevert(note._id, version._id)}
                              >
                                Revert
                              </button>
                              <button
                                className="bg-red-600 text-white px-2 py-1 text-sm rounded hover:bg-red-700 transition-colors duration-300"
                                onClick={() => handleDeleteVersion(note._id, version._id)}
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                    <button
                      className="mt-4 bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600 transition-colors duration-300"
                      onClick={() => setSelectedNoteHistory(null)}
                    >
                      Close History
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HandwrittenNotes;