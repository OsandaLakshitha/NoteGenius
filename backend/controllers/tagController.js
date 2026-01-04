const Tag = require('../models/Tag');

// Create a new tag
exports.createTag = async (req, res) => {
  try {
    const { name, userId } = req.body;
    if (!name) return res.status(400).json({ message: 'Tag name is required' });
    if (!userId) return res.status(400).json({ message: 'User ID is required' });

    const existingTag = await Tag.findOne({ name, userId });
    if (existingTag) return res.status(400).json({ message: 'Tag already exists' });

    const newTag = new Tag({ name, userId });
    await newTag.save();
    res.status(201).json(newTag);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Tag already exists' });
    }
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

// Get tags by user ID
exports.getTagsByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId) return res.status(400).json({ message: 'User ID is required' });
    
    const tags = await Tag.find({ userId }).sort({ name: 1 });
    res.json(tags);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Update a tag
exports.updateTag = async (req, res) => {
  try {
    const { name, userId } = req.body;
    
    // First check if tag exists and belongs to the user
    const existingTag = await Tag.findOne({ _id: req.params.id, userId });
    if (!existingTag) return res.status(404).json({ message: 'Tag not found or unauthorized' });
    
    // Check if the new name would create a duplicate
    if (name !== existingTag.name) {
      const duplicateTag = await Tag.findOne({ name, userId });
      if (duplicateTag) return res.status(400).json({ message: 'Tag name already exists' });
    }

    const tag = await Tag.findByIdAndUpdate(req.params.id, { name }, { new: true });
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
