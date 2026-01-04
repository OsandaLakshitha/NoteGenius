const express = require("express");
const router = express.Router();
const tagController = require("../controllers/tagController");

router.post("/create-tags", tagController.createTag);
router.get("/", tagController.getAllTags);
// Get tags by user ID
router.get("/tags/:userId", tagController.getTagsByUser);

router.put("/:id", tagController.updateTag);
router.delete("/:id", tagController.deleteTag);

module.exports = router;
