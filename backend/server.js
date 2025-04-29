const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const handwrittenNoteRoutes = require('./routes/handwrittenNoteRoutes');
const voiceNoteRoutes = require('./routes/voiceNoteRoutes');
const structuredTextRoutes = require('./routes/structuredTextRoutes');
const folderRoutes = require('./routes/folderRoutes');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Add this for form data
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // Serve uploaded files

// Routes
app.use('/api/handwritten-notes', handwrittenNoteRoutes);
app.use('/api/voice-notes', voiceNoteRoutes);
app.use('/api/structured-texts', structuredTextRoutes);

//Folder Routes
app.use('/api/folders',folderRoutes);

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('MongoDB Connected'))
  .catch((err) => console.log(err));

// Start Server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));