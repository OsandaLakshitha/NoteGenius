import React, { useState, useEffect } from "react";
import {
  getStructuredTexts,
  extractTextFromImage,
  deleteStructuredText,
} from "../services/api";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FaFileUpload, FaFileAlt, FaTrash } from "react-icons/fa";

const StructuredText = () => {
  const [structuredTexts, setStructuredTexts] = useState([]);
  const [title, setTitle] = useState("");
  const [image, setImage] = useState(null);
  const [extractedText, setExtractedText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);

  // Get user info from Redux store
  const userInfo = useSelector((state) => state.auth.userInfo);
  const navigate = useNavigate();

  // Redirect to login if user is not logged in
  useEffect(() => {
    if (!userInfo) {
      navigate("/login");
    }
  }, [userInfo, navigate]);

  // Fetch structured texts on mount
  useEffect(() => {
    fetchStructuredTexts();
  }, []);

  const fetchStructuredTexts = async () => {
    try {
      const response = await getStructuredTexts();
      setStructuredTexts(response.data);
    } catch (error) {
      console.error("Failed to fetch structured texts:", error);
    }
  };

  // Handle image selection with preview
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      alert("Please provide a title for your note");
      return;
    }

    if (!image) {
      alert("Please select an image to extract text from");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("image", image);

    try {
      const response = await extractTextFromImage(formData);
      setExtractedText(response.data.extractedText);
      setTitle("");
      setImage(null);
      setImagePreview(null);
      fetchStructuredTexts();
    } catch (err) {
      console.error("Error extracting text:", err);
      alert("Failed to extract text from image. Please try again.");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this note?")) {
      try {
        await deleteStructuredText(id);
        fetchStructuredTexts();
      } catch (error) {
        console.error("Failed to delete note:", error);
      }
    }
  };

  return (
    <div className="container mx-auto py-12 px-6 max-w-7xl">
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-10">
        Structured Text
      </h1>

      {/* Upload Form */}
      <div className="bg-white p-6 rounded-xl shadow-lg mb-10 border border-gray-100">
        <h2 className="text-2xl font-semibold mb-5 text-gray-700 border-b pb-2">
          Extract Text from Image
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Enter note title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          <div className="border-dashed border-2 border-gray-300 rounded-md p-6 text-center hover:border-blue-400 transition-colors">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              required
              className="hidden"
              id="image-upload"
            />
            <label
              htmlFor="image-upload"
              className="cursor-pointer flex flex-col items-center justify-center"
            >
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="max-h-48 mb-4 rounded-md"
                />
              ) : (
                <FaFileUpload className="text-4xl text-gray-400 mb-2" />
              )}
              <p className="text-gray-600">
                {imagePreview ? "Change image" : "Select an image to upload"}
              </p>
            </label>
          </div>

          <button
            type="submit"
            className="flex items-center justify-center bg-blue-600 text-white px-5 py-3 rounded-md hover:bg-blue-700 transition-colors"
          >
            <FaFileAlt className="mr-2" /> Extract Text
          </button>
        </form>
      </div>

      {/* Display Extracted Text */}
      {extractedText && (
        <div className="bg-white p-6 rounded-xl shadow-md mb-8 border border-gray-100">
          <h3 className="text-xl font-semibold mb-3 text-gray-800 border-b pb-2">
            Extracted Text
          </h3>
          <p className="text-gray-600 whitespace-pre-wrap">{extractedText}</p>
        </div>
      )}

      {/* List of Notes */}
      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-6 text-gray-700 border-b pb-2">
          Your Structured Text Notes
        </h2>

        {structuredTexts.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl shadow-md border border-gray-100">
            <p className="text-gray-500 text-lg">
              No structured text notes found
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {structuredTexts.map((text) => (
              <div
                key={text._id}
                className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow border border-gray-100"
              >
                <h3 className="text-xl font-semibold mb-3 text-gray-800">
                  {text.title}
                </h3>

                <div className="border-t border-b border-gray-100 py-3 my-3">
                  <img
                    src={`http://localhost:5000/uploads/${text.imagePath}`}
                    alt="Uploaded"
                    className="w-full h-48 object-cover rounded-md mb-4"
                  />
                  <p className="text-gray-600 whitespace-pre-wrap">
                    {text.extractedText}
                  </p>
                </div>

                <div className="flex mt-4">
                  <button
                    className="flex-1 flex items-center justify-center bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors"
                    onClick={() => handleDelete(text._id)}
                  >
                    <FaTrash className="mr-2" />
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StructuredText;
