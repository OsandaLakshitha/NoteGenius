const { createWorker } = require('tesseract.js');
const path = require('path');
const multer = require('multer');
const StructuredText = require('../models/StructuredText');

// Multer configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

exports.upload = multer({ storage });

// Text extraction function
exports.extractTextFromImage = async (req, res) => {
  try {
    const { title } = req.body;
    const imagePath = req.file.path;

    const worker = await createWorker();
    const { data: { text } } = await worker.recognize(imagePath);
    await worker.terminate();

    const newStructuredText = new StructuredText({
      title,
      extractedText: text,
      imagePath: req.file.filename
    });

    await newStructuredText.save();
    res.status(201).json(newStructuredText);
  } catch (err) {
    console.error('OCR Error:', err);
    res.status(500).json({ error: 'Failed to extract text' });
  }
};

// Get all structured texts
exports.getStructuredTexts = async (req, res) => {
  try {
    const structuredTexts = await StructuredText.find();
    res.status(200).json(structuredTexts);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete structured text
exports.deleteStructuredText = async (req, res) => {
  try {
    const { id } = req.params;
    await StructuredText.findByIdAndDelete(id);
    res.status(200).json({ message: 'Structured text deleted' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};