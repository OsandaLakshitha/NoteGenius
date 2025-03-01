const express = require('express');
const router = express.Router();
const structuredTextController = require('../controllers/structuredTextController');

router.post('/', 
  structuredTextController.upload.single('image'),
  structuredTextController.extractTextFromImage
);

router.get('/', structuredTextController.getStructuredTexts);
router.delete('/:id', structuredTextController.deleteStructuredText);

module.exports = router;