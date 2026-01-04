const express = require("express");
const router = express.Router();
const {
  createNote,
  getNotes,
  updateNote,
  deleteNote,
  getNotesByUser,
  getNoteHistory,
  revertNote,
  deleteVersion,
} = require("../controllers/handwrittenNoteController");

router.post("/", createNote);
router.get("/", getNotes);
router.get("/notes/:userId", getNotesByUser);
router.put("/:id", updateNote);
router.delete("/:id", deleteNote);

// Note history operations
router.get("/:id/history", getNoteHistory);
router.put("/:id/revert/:versionId", revertNote);
router.delete("/:id/history/:versionId", deleteVersion);

module.exports = router;
