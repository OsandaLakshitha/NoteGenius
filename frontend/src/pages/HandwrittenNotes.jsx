import React, { useEffect, useState } from "react";
import {
  getNotes,
  createNote,
  updateNote,
  deleteNote,
  getTags,
  createTag,
  updateTag,
  deleteTag,
} from "../services/api";
import Swal from "sweetalert2";

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

// TagCreation Component
const TagCreation = ({ tags, setTags, setError }) => {
  const handleCreateTag = async () => {
    const { value: newTag } = await Swal.fire({
      title: "Create New Tag",
      input: "text",
      inputPlaceholder: "Enter tag name",
      showCancelButton: true,
      confirmButtonText: "Add Tag",
      cancelButtonText: "Cancel",
      inputValidator: (value) => {
        if (!value || value.trim() === "") {
          return "Tag name cannot be empty!";
        }
      },
      customClass: {
        confirmButton: "bg-teal-500 text-white font-semibold py-2 px-4 rounded-lg mr-2",
        cancelButton: "bg-gray-300 text-black font-semibold py-2 px-4 rounded-lg",
      },
      buttonsStyling: false,
    });

    if (newTag) {
      try {
        const response = await createTag({ name: newTag });
        setTags((prevTags) => [...prevTags, response.data]);
        Swal.fire({
          icon: "success",
          title: "Tag Created",
          text: `Tag "${newTag}" has been successfully created!`,
          confirmButtonText: "OK",
          customClass: {
            confirmButton: "bg-indigo-500 text-white font-semibold py-2 px-4 rounded-lg",
          },
          buttonsStyling: false,
        });
      } catch (error) {
        setError("Failed to create tag.");
        console.error("Error creating tag:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to create tag!",
        });
      }
    }
  };

  return (
    <div className="relative group flex items-center">
      <button
        className="inline-flex items-center justify-center whitespace-nowrap transition-colors focus-visible:outline-none bg-transparent text-gray-900 border border-indigo-500 hover:border-indigo-600 rounded-full p-3 size-10 group hover:w-auto gap-1"
        onClick={handleCreateTag}
        type="button"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 14 14"
          className="size-4 fill-current"
        >
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
      <p className="hidden group-hover:block font-medium text-gray-900 ml-2">
        Add Tag
      </p>
    </div>
  );
};

// Updated TagMenu Component
const TagMenu = ({ tag, tags, setTags, setError, filterTag, setFilterTag }) => {
  const [showMenu, setShowMenu] = useState(false);

  const handleEditTag = async () => {
    const { value: updatedTagName } = await Swal.fire({
      title: "Edit Tag",
      input: "text",
      inputValue: tag.name,
      inputPlaceholder: "Enter new tag name",
      showCancelButton: true,
      confirmButtonText: "Save",
      cancelButtonText: "Cancel",
      inputValidator: (value) => {
        if (!value || value.trim() === "") {
          return "Tag name cannot be empty!";
        }
      },
      customClass: {
        confirmButton: "bg-indigo-500 text-white font-semibold py-2 px-4 rounded-lg mr-2",
        cancelButton: "bg-gray-300 text-black font-semibold py-2 px-4 rounded-lg",
      },
      buttonsStyling: false,
    });

    if (updatedTagName) {
      try {
        const updatedTag = await updateTag(tag._id, { name: updatedTagName });
        setTags((prevTags) =>
          prevTags.map((t) => (t._id === tag._id ? updatedTag.data : t))
        );
        Swal.fire({
          icon: "success",
          title: "Tag Updated",
          text: `Tag "${updatedTagName}" has been successfully updated!`,
        });
      } catch (error) {
        setError("Failed to update tag.");
        console.error("Error updating tag:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to update tag!",
        });
      }
    }
    setShowMenu(false);
  };

  const handleDeleteTag = async () => {
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
      try {
        await deleteTag(tag._id);
        setTags((prevTags) => prevTags.filter((t) => t._id !== tag._id));
        if (filterTag === tag._id) setFilterTag(null);
        Swal.fire({
          icon: "success",
          title: "Tag Deleted",
          text: `Tag "${tag.name}" has been successfully deleted!`,
        });
      } catch (error) {
        setError("Failed to delete tag.");
        console.error("Error deleting tag:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to delete tag!",
        });
      }
    }
    setShowMenu(false);
  };

  return (
    <div className="relative inline-block">
      <ModernButton
        borderColor={filterTag === tag._id ? "indigo-500" : "blue-500"}
        onClick={() => setFilterTag(tag._id)}
      >
        #{tag.name}
        <span
          className="ml-2 cursor-pointer hover:text-gray-700"
          onClick={(e) => {
            e.stopPropagation();
            setShowMenu((prev) => !prev);
          }}
        >
          ⋮
        </span>
      </ModernButton>
      {showMenu && (
        <div className="absolute right-0 mt-2 bg-white border border-gray-200 shadow-lg rounded-lg z-10">
          <button
            className="block text-left px-4 py-1 text-gray-700 hover:bg-gray-100 rounded-t-lg whitespace-nowrap"
            onClick={handleEditTag}
          >
            Edit Tag
          </button>
          <button
            className="block text-left px-4 py-1 text-gray-700 hover:bg-gray-100 rounded-b-lg whitespace-nowrap"
            onClick={handleDeleteTag}
          >
            Delete Tag
          </button>
        </div>
      )}
    </div>
  );
};

const HandwrittenNotes = () => {
  const [notes, setNotes] = useState([]);
  const [tags, setTags] = useState([]);
  const [newNote, setNewNote] = useState({ title: "", content: "", tags: [] });
  const [editableNote, setEditableNote] = useState({
    id: null,
    title: "",
    content: "",
    tags: [],
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [searchType, setSearchType] = useState("title");
  const [showTagSelectionDropdown, setShowTagSelectionDropdown] = useState(false);
  const [filterTag, setFilterTag] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchNotes();
    fetchTags();
  }, []);

  const fetchNotes = async () => {
    setLoading(true);
    try {
      const response = await getNotes();
      setNotes(response.data);
    } catch (error) {
      setError("Failed to fetch notes.");
      console.error("Error fetching notes:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTags = async () => {
    try {
      const response = await getTags();
      setTags(response.data);
    } catch (error) {
      setError("Failed to fetch tags.");
      console.error("Error fetching tags:", error);
    }
  };

  const handleCreate = async () => {
    if (!newNote.title.trim() || !newNote.content.trim()) {
      setError("Title and content cannot be empty!");
      return;
    }
    setLoading(true);
    try {
      await createNote({
        title: newNote.title,
        content: newNote.content,
        tags: newNote.tags,
      });
      setNewNote({ title: "", content: "", tags: [] });
      setError(null);
      fetchNotes();
    } catch (error) {
      setError("Failed to create note.");
      console.error("Error creating note:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleTagSelection = (tagId) => {
    setNewNote((prev) => ({
      ...prev,
      tags: prev.tags.includes(tagId)
        ? prev.tags.filter((id) => id !== tagId)
        : [...prev.tags, tagId],
    }));
    setShowTagSelectionDropdown(false);
  };

  const handleEdit = (note) => {
    setEditableNote({
      id: note._id,
      title: note.title,
      content: note.content,
      tags: note.tags.map((tag) => (typeof tag === "object" ? tag._id : tag)),
    });
  };

  const handleUpdate = async () => {
    setLoading(true);
    try {
      await updateNote(editableNote.id, {
        title: editableNote.title,
        content: editableNote.content,
      });
      setEditableNote({ id: null, title: "", content: "", tags: [] });
      setError(null);
      fetchNotes();
    } catch (error) {
      setError("Failed to update note.");
      console.error("Error updating note:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    setLoading(true);
    try {
      await deleteNote(id);
      setError(null);
      fetchNotes();
    } catch (error) {
      setError("Failed to delete note.");
      console.error("Error deleting note:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredNotes = notes.filter((note) => {
    const searchText = searchTerm.toLowerCase();
    const matchesSearch =
      searchType === "title"
        ? note.title.toLowerCase().includes(searchText)
        : note.content.toLowerCase().includes(searchText);
    const matchesTag = filterTag
      ? note.tags.some(
          (tag) => (typeof tag === "object" ? tag._id : tag) === filterTag
        )
      : true;
    return matchesSearch && matchesTag;
  });

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-indigo-50 via-white to-gray-50 min-h-screen px-6 py-12">
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-20 left-10 w-64 h-64 bg-indigo-100 rounded-full opacity-30 blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-blue-100 rounded-full opacity-40 blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 text-center">
          Handwritten <span className="text-indigo-600">Notes</span>
        </h1>

        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
        {loading && (
          <p className="text-gray-600 mb-4 text-center">Loading...</p>
        )}

        {/* Search Bar */}
        <div className="flex flex-col sm:flex-row items-center mb-8 gap-4">
          <input
            type="text"
            placeholder="Search notes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:flex-grow p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-600"
          />
          <select
            onChange={(e) => setSearchType(e.target.value)}
            value={searchType}
            className="w-full sm:w-32 p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-600"
          >
            <option value="title">Title</option>
            <option value="content">Content</option>
          </select>
        </div>

        {/* Filter by Tags */}
        <div className="mb-8">
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Filter by Tag:
          </h3>
          <div className="flex flex-wrap gap-2 items-center relative">
            <TagCreation tags={tags} setTags={setTags} setError={setError} />
            <ModernButton
              borderColor={!filterTag ? "indigo-500" : "blue-500"}
              onClick={() => setFilterTag(null)}
            >
              All
            </ModernButton>
            {tags.map((tag) => (
              <TagMenu
                key={tag._id}
                tag={tag}
                tags={tags}
                setTags={setTags}
                setError={setError}
                filterTag={filterTag}
                setFilterTag={setFilterTag}
              />
            ))}
          </div>
        </div>

        {/* Create Note */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Create a New Note
          </h2>
          <input
            type="text"
            placeholder="Title"
            value={newNote.title}
            onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-600"
          />
          <textarea
            placeholder="Content"
            value={newNote.content}
            onChange={(e) =>
              setNewNote({ ...newNote, content: e.target.value })
            }
            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm mb-4 h-32 focus:outline-none focus:ring-2 focus:ring-indigo-600"
          />
          <div className="relative mb-4">
            <ModernButton
              borderColor="indigo-500"
              onClick={() => setShowTagSelectionDropdown(!showTagSelectionDropdown)}
            >
              Select Tags
            </ModernButton>
            {showTagSelectionDropdown && (
              <div className="absolute bg-white p-4 shadow-lg rounded-lg mt-2 w-64 z-10">
                {tags.map((tag) => (
                  <div
                    key={tag._id}
                    className="flex items-center mb-2 cursor-pointer"
                    onClick={() => toggleTagSelection(tag._id)}
                  >
                    <input
                      type="checkbox"
                      checked={newNote.tags.includes(tag._id)}
                      readOnly
                      className="mr-2"
                    />
                    <span className="text-gray-700">{tag.name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
          <ModernButton
            borderColor="blue-600"
            onClick={handleCreate}
            disabled={loading}
          >
            Create Note
          </ModernButton>
        </div>

        {/* Display Notes */}
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Your Notes
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredNotes.map((note) => (
              <div
                key={note._id}
                className="bg-white p-6 rounded-2xl shadow-lg"
              >
                {editableNote.id === note._id ? (
                  <div>
                    <input
                      type="text"
                      value={editableNote.title}
                      onChange={(e) =>
                        setEditableNote({
                          ...editableNote,
                          title: e.target.value,
                        })
                      }
                      className="w-full p-3 border border-gray-300 rounded-lg shadow-sm mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                    />
                    <textarea
                      value={editableNote.content}
                      onChange={(e) =>
                        setEditableNote({
                          ...editableNote,
                          content: e.target.value,
                        })
                      }
                      className="w-full p-3 border border-gray-300 rounded-lg shadow-sm mb-4 h-24 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                    />
                    <div className="flex gap-4">
                      <ModernButton
                        borderColor="indigo-500"
                        onClick={handleUpdate}
                        disabled={loading}
                      >
                        Save
                      </ModernButton>
                      <ModernButton
                        borderColor="blue-500"
                        onClick={() =>
                          setEditableNote({
                            id: null,
                            title: "",
                            content: "",
                            tags: [],
                          })
                        }
                      >
                        Cancel
                      </ModernButton>
                    </div>
                  </div>
                ) : (
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {note.title}
                    </h3>
                    <p className="text-gray-600 mb-4">{note.content}</p>
                    <div className="flex gap-2 mb-4 flex-wrap">
                      {note.tags.map((tag) => {
                        const tagObj =
                          typeof tag === "object"
                            ? tag
                            : tags.find((t) => t._id === tag);
                        return tagObj ? (
                          <span
                            key={tagObj._id}
                            className="bg-indigo-100 text-indigo-800 px-2 py-1 rounded-lg text-sm"
                          >
                            #{tagObj.name}
                          </span>
                        ) : null;
                      })}
                    </div>
                    <div className="flex gap-4">
                      <ModernButton
                        borderColor="blue-500"
                        onClick={() => handleEdit(note)}
                      >
                        Edit
                      </ModernButton>
                      <ModernButton
                        borderColor="teal-500"
                        onClick={() => handleDelete(note._id)}
                        disabled={loading}
                      >
                        Delete
                      </ModernButton>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HandwrittenNotes;