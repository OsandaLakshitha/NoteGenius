import axios from 'axios';

// Base configuration
const createApiClient = (baseURL) => axios.create({
  baseURL: `http://localhost:5000${baseURL}`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Handwritten Notes API
const handwrittenNotesApi = createApiClient('/api/handwritten-notes');
export const getNotes = () => handwrittenNotesApi.get('/');
export const createNote = (note) => handwrittenNotesApi.post('/', note);
export const updateNote = (id, note) => handwrittenNotesApi.put(`/${id}`, note);
export const deleteNote = (id) => handwrittenNotesApi.delete(`/${id}`);

// Voice Notes API
const voiceNotesApi = createApiClient('/api/voice-notes');
export const getVoiceNotes = () => voiceNotesApi.get('/');
export const createVoiceNote = (voiceNote) => voiceNotesApi.post('/', voiceNote);
export const updateVoiceNote = (id, voiceNote) => voiceNotesApi.put(`/${id}`, voiceNote);
export const deleteVoiceNote = (id) => voiceNotesApi.delete(`/${id}`);

// Structured Text API
const structuredTextApi = axios.create({
  baseURL: 'http://localhost:5000/api/structured-texts', // Add trailing slash if needed
});

export const getStructuredTexts = () => structuredTextApi.get('/');
export const extractTextFromImage = (formData) => structuredTextApi.post('/', formData, {
  headers: { 'Content-Type': 'multipart/form-data' },
});
export const deleteStructuredText = (id) => structuredTextApi.delete(`/${id}`);

// frontend/src/services/api.js
export const askQuestion = (data) => 
  axios.post('http://localhost:5000/api/chatbot/ask', data);

// Folder API
const folderApi = createApiClient('/api/folders');
export const getFolders = () => folderApi.get('/');
export const createFolder = (folder) => folderApi.post('/create-folder', folder);
export const updateFolder = (id, folder) => folderApi.put(`/${id}`, folder);
export const deleteFolder = (id) => folderApi.delete(`/${id}`);
export const addNoteToFolder = (id, note) => folderApi.post(`/${id}/add-note`, note);
export const getNotesInFolder = (id) => folderApi.get(`/${id}/notes`);
export const removeNoteFromFolder = (id, noteId) => folderApi.delete(`/${id}/remove-note/${noteId}`);

// Tags API
const tagsApi = createApiClient('/api/tags');
export const getTags = () => tagsApi.get('/');
export const createTag = (tag) => tagsApi.post('/', tag);
export const updateTag = (id, tag) => tagsApi.put(`/${id}`, tag);
export const deleteTag = (id) => tagsApi.delete(`/${id}`);
