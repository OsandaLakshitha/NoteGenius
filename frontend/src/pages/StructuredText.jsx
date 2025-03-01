import React, { useState, useEffect } from 'react';
import { getStructuredTexts, extractTextFromImage, deleteStructuredText } from '../services/api';

const StructuredText = () => {
  const [structuredTexts, setStructuredTexts] = useState([]);
  const [title, setTitle] = useState('');
  const [image, setImage] = useState(null);
  const [extractedText, setExtractedText] = useState('');

  // Fetch structured texts on mount
  useEffect(() => {
    fetchStructuredTexts();
  }, []);

  const fetchStructuredTexts = async () => {
    const response = await getStructuredTexts();
    setStructuredTexts(response.data);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', title);
    formData.append('image', image); // Ensure the field name is "image"

    try {
      const response = await extractTextFromImage(formData);
      setExtractedText(response.data.extractedText);
      setTitle('');
      setImage(null);
      fetchStructuredTexts();
    } catch (err) {
      console.error('Error extracting text:', err);
    }
  };

  return (
    <div className="app-container">
      <h1>Structured Text</h1>

      {/* Upload Form */}
      <form onSubmit={handleSubmit} className="upload-form">
        <input
          type="text"
          placeholder="Note Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])} // Capture the file
          required
        />
        <button type="submit" className="cta-button">
          Extract Text
        </button>
      </form>

      {/* Display Extracted Text */}
      {extractedText && (
        <div className="extracted-text">
          <h3>Extracted Text:</h3>
          <pre>{extractedText}</pre> {/* Use pre for formatted text */}
        </div>
      )}

      {/* List of Notes */}
      <div className="notes-section">
        {structuredTexts.map((text) => (
          <div key={text._id} className="note-card">
            <h3>{text.title}</h3>
            <p>{text.extractedText}</p>
            <img src={`http://localhost:5000/uploads/${text.imagePath}`} alt="Uploaded" width="200" />
            <button className="cta-button" onClick={() => deleteStructuredText(text._id)}>
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StructuredText;