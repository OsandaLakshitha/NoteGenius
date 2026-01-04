import axios from "axios";

// Base configuration
const createApiClient = (baseURL) =>
  axios.create({
    baseURL: `http://localhost:5000${baseURL}`,
    headers: {
      "Content-Type": "application/json",
    },
  });

// Handwritten Notes API
const handwrittenNotesApi = createApiClient("/api/handwritten-notes");
export const getNotes = () => handwrittenNotesApi.get("/");
export const getNotesuser = (userId) => handwrittenNotesApi.get(`/notes/${userId}`);
export const createNote = (note) => handwrittenNotesApi.post("/", note);
export const updateNote = (id, note) => handwrittenNotesApi.put(`/${id}`, note);
export const deleteNote = (id, { userId }) => handwrittenNotesApi.delete(`/${id}`, { data: { userId } });
export const getNoteHistory = (id) => handwrittenNotesApi.get(`/${id}/history`);
export const revertNote = (id, versionId) => handwrittenNotesApi.put(`/${id}/revert/${versionId}`);
export const deleteVersion = (id, versionId) => handwrittenNotesApi.delete(`/${id}/history/${versionId}`);

// Voice Notes API
const voiceNotesApi = createApiClient("/api/voice-notes");
export const getVoiceNotes = () => voiceNotesApi.get("/");
export const createVoiceNote = (voiceNote) =>
  voiceNotesApi.post("/", voiceNote);
export const updateVoiceNote = (id, voiceNote) =>
  voiceNotesApi.put(`/${id}`, voiceNote);
export const deleteVoiceNote = (id) => voiceNotesApi.delete(`/${id}`);

// Structured Text API
const structuredTextApi = axios.create({
  baseURL: "http://localhost:5000/api/structured-texts",
});

export const getStructuredTexts = () => structuredTextApi.get("/");
export const extractTextFromImage = (formData) =>
  structuredTextApi.post("/", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
export const deleteStructuredText = (id) => structuredTextApi.delete(`/${id}`);

// Chatbot API
export const askQuestion = (data) =>
  axios.post("http://localhost:5000/api/chatbot/ask", data);

// Folder API
const folderApi = createApiClient("/api/folders");
export const getFolders = () => folderApi.get("/");
export const getFoldersusr = (userId) => folderApi.get(`/folders/${userId}`);
export const createFolder = (folder) =>
  folderApi.post("/create-folder", folder);
export const updateFolder = (id, folder) => folderApi.put(`/${id}`, folder);
export const deleteFolder = (id) => folderApi.delete(`/${id}`);
export const addNoteToFolder = (id, note) =>
  folderApi.post(`/${id}/add-note`, note);
export const getNotesInFolder = (id) => folderApi.get(`/${id}/notes`);
export const removeNoteFromFolder = (id, noteId) =>
  folderApi.delete(`/${id}/remove-note/${noteId}`);

// Tags API
const tagsApi = createApiClient('/api/tags');
export const getTags = () => tagsApi.get('/');
export const getTagsByUser = (userId) => tagsApi.get(`/tags/${userId}`);
export const createTag = (tag) => tagsApi.post('/create-tags', tag);
export const updateTag = (id, tag) => tagsApi.put(`/${id}`, tag);
export const deleteTag = (id) => tagsApi.delete(`/${id}`);