const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const cookieParser = require('cookie-parser');
const userRoutes = require('./routes/userRoutes');
const handwrittenNoteRoutes = require('./routes/handwrittenNoteRoutes');
const voiceNoteRoutes = require('./routes/voiceNoteRoutes');
const structuredTextRoutes = require('./routes/structuredTextRoutes');
const folderRoutes = require('./routes/folderRoutes');
const { notFound, errorHandler } = require('./middleware/errorMiddleware.js');
const tagRoutes = require('./routes/tagRoutes.js');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cookieParser());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Add this for form data
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // Serve uploaded files


// Routes
app.use('/api/handwritten-notes', handwrittenNoteRoutes);
app.use('/api/voice-notes', voiceNoteRoutes);
app.use('/api/structured-texts', structuredTextRoutes);

// Tag Routes
app.use('/api/tags', tagRoutes);

//Folder Routes
app.use('/api/folders',folderRoutes);
//User routes
app.use('/api/users', userRoutes);

// MongoDB Connection
(require('mongoose'))
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('MongoDB Connected'))
  .catch((err) => console.log(err));

app.use(notFound);
app.use(errorHandler);

// Start Server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));