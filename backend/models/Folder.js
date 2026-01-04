const mongoose = require("mongoose");
const predefinedColors = ["red", "blue", "green", "yellow", "purple", "orange"]; // Define available colors

const FolderSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  color: {
    type: String,
    enum: predefinedColors, // Restrict colors to predefined set
    default: "blue", // Default color
  },
  notes: [
    {
      noteId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        refPath: "notes.type", // Reference note ID
      },
      type: {
        type: String,
        required: true,
        enum: ["HandwrittenNote", "StructuredText", "VoiceNote"], // Store note type
      },
      addedAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Folder", FolderSchema);
