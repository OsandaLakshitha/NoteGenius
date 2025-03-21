const Tag = require('../models/Tag');

// Create a new tag
exports.createTag = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ message: 'Tag name is required' });

    const existingTag = await Tag.findOne({ name });
    if (existingTag) return res.status(400).json({ message: 'Tag already exists' });

    const newTag = new Tag({ name });
    await newTag.save();
    res.status(201).json(newTag);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Get all tags
exports.getAllTags = async (req, res) => {
  try {
    const tags = await Tag.find().sort({ name: 1 });
    res.json(tags);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Update a tag
exports.updateTag = async (req, res) => {
  try {
    const { name } = req.body;
    const tag = await Tag.findByIdAndUpdate(req.params.id, { name }, { new: true });

    if (!tag) return res.status(404).json({ message: 'Tag not found' });

    res.json(tag);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Delete a tag
exports.deleteTag = async (req, res) => {
  try {
    const tag = await Tag.findByIdAndDelete(req.params.id);

    if (!tag) return res.status(404).json({ message: 'Tag not found' });

    res.json({ message: 'Tag deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};
