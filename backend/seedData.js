const mongoose = require("mongoose");
const dotenv = require("dotenv");
const User = require("./models/userModel");
const HandwrittenNote = require("./models/HandwrittenNote");
const VoiceNote = require("./models/VoiceNote");
const StructuredText = require("./models/StructuredText");
const Folder = require("./models/Folder");
const Tag = require("./models/Tag");

dotenv.config();

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB Connected for seeding"))
  .catch((err) => {
    console.log("Error connecting to MongoDB:", err);
    process.exit(1);
  });

// Mock Data
const users = [
  {
    name: "Admin User",
    email: "admin@example.com",
    password: "admin123",
    isAdmin: true,
  },
  {
    name: "John Doe",
    email: "john@example.com",
    password: "password123",
    isAdmin: false,
  },
  {
    name: "Jane Smith",
    email: "jane@example.com",
    password: "password123",
    isAdmin: false,
  },
  {
    name: "Bob Wilson",
    email: "bob@example.com",
    password: "password123",
    isAdmin: false,
  },
  {
    name: "Alice Johnson",
    email: "alice@example.com",
    password: "password123",
    isAdmin: false,
  },
];

const importData = async () => {
  try {
    // Clear existing data
    await User.deleteMany();
    await HandwrittenNote.deleteMany();
    await VoiceNote.deleteMany();
    await StructuredText.deleteMany();
    await Folder.deleteMany();
    await Tag.deleteMany();

    console.log("Data Destroyed!");

    // Insert users - use create() instead of insertMany() to trigger bcrypt hashing
    const createdUsers = [];
    for (const userData of users) {
      const user = await User.create(userData);
      createdUsers.push(user);
    }
    console.log(`${createdUsers.length} users created!`);

    // Get regular users (non-admin) for creating notes
    const regularUsers = createdUsers.filter((user) => !user.isAdmin);

    // Create tags for each user
    const tagsData = [];
    for (const user of regularUsers) {
      tagsData.push(
        { userId: user._id.toString(), name: "Important" },
        { userId: user._id.toString(), name: "Work" },
        { userId: user._id.toString(), name: "Personal" },
        { userId: user._id.toString(), name: "Study" }
      );
    }
    const createdTags = await Tag.insertMany(tagsData);
    console.log(`${createdTags.length} tags created!`);

    // Create handwritten notes
    const handwrittenNotes = [];
    for (const user of regularUsers) {
      const userTags = createdTags.filter(
        (tag) => tag.userId === user._id.toString()
      );

      handwrittenNotes.push(
        {
          userId: user._id.toString(),
          title: "Meeting Notes",
          content:
            "Discussed project timeline and deliverables. Need to follow up with team next week.",
          tags: userTags.slice(0, 2).map((tag) => tag._id),
        },
        {
          userId: user._id.toString(),
          title: "Ideas for Next Quarter",
          content:
            "Brainstorming session ideas: 1. Improve user experience 2. Add new features 3. Performance optimization",
          tags: userTags.slice(1, 3).map((tag) => tag._id),
        }
      );
    }
    const createdHandwrittenNotes = await HandwrittenNote.insertMany(
      handwrittenNotes
    );
    console.log(`${createdHandwrittenNotes.length} handwritten notes created!`);

    // Create voice notes
    const voiceNotes = [];
    for (const user of regularUsers) {
      voiceNotes.push(
        {
          title: "Quick Reminder",
          transcript:
            "Remember to send the report to the manager by Friday evening.",
        },
        {
          title: "Shopping List",
          transcript:
            "Need to buy milk, eggs, bread, and coffee from the store.",
        }
      );
    }
    const createdVoiceNotes = await VoiceNote.insertMany(voiceNotes);
    console.log(`${createdVoiceNotes.length} voice notes created!`);

    // Create structured texts
    const structuredTexts = [];
    for (const user of regularUsers) {
      structuredTexts.push(
        {
          title: "Document Scan",
          extractedText:
            "This is extracted text from a scanned document containing important information.",
          imagePath: "/uploads/sample1.jpg",
        },
        {
          title: "Receipt Image",
          extractedText:
            "Receipt from Store ABC. Total: $45.99. Date: 12/25/2025",
          imagePath: "/uploads/sample2.jpg",
        }
      );
    }
    const createdStructuredTexts = await StructuredText.insertMany(
      structuredTexts
    );
    console.log(`${createdStructuredTexts.length} structured texts created!`);

    // Create folders
    const folders = [];
    for (const user of regularUsers) {
      const userHandwrittenNotes = createdHandwrittenNotes.filter(
        (note) => note.userId === user._id.toString()
      );

      folders.push({
        userId: user._id.toString(),
        name: "Work Projects",
        color: "blue",
        notes: userHandwrittenNotes.slice(0, 1).map((note) => ({
          noteId: note._id,
          type: "HandwrittenNote",
        })),
      });

      folders.push({
        userId: user._id.toString(),
        name: "Personal Notes",
        color: "green",
        notes: userHandwrittenNotes.slice(1, 2).map((note) => ({
          noteId: note._id,
          type: "HandwrittenNote",
        })),
      });
    }
    const createdFolders = await Folder.insertMany(folders);
    console.log(`${createdFolders.length} folders created!`);

    console.log("\n✅ Mock data imported successfully!");
    console.log("\n📝 Sample Login Credentials:");
    console.log("Admin: admin@example.com / admin123");
    console.log("User: john@example.com / password123");

    process.exit();
  } catch (error) {
    console.error("Error importing data:", error);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await User.deleteMany();
    await HandwrittenNote.deleteMany();
    await VoiceNote.deleteMany();
    await StructuredText.deleteMany();
    await Folder.deleteMany();
    await Tag.deleteMany();

    console.log("✅ Data Destroyed!");
    process.exit();
  } catch (error) {
    console.error("Error destroying data:", error);
    process.exit(1);
  }
};

// Check command line arguments
if (process.argv[2] === "-d") {
  destroyData();
} else {
  importData();
}
