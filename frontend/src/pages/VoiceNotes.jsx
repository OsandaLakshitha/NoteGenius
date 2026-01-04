import React, { useState, useEffect, useRef } from "react";
import {
  getVoiceNotes,
  createVoiceNote,
  deleteVoiceNote,
} from "../services/api";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FaMicrophone, FaStop, FaSave, FaTrash } from "react-icons/fa";

const VoiceNotes = () => {
  const [voiceNotes, setVoiceNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [finalTranscript, setFinalTranscript] = useState("");
  const recognition = useRef(null);

  // Get user info from Redux store
  const userInfo = useSelector((state) => state.auth.userInfo);
  const navigate = useNavigate();

  // Redirect to login if user is not logged in
  useEffect(() => {
    if (!userInfo) {
      navigate("/login");
    }
  }, [userInfo, navigate]);

  useEffect(() => {
    if ("SpeechRecognition" in window || "webkitSpeechRecognition" in window) {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      recognition.current = new SpeechRecognition();
      recognition.current.continuous = false;
      recognition.current.interimResults = false;
      recognition.current.lang = "en-US";

      recognition.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setTranscript(transcript);
        setFinalTranscript(transcript);
      };

      recognition.current.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
      };

      recognition.current.onend = () => {
        setIsRecording(false);
      };
    } else {
      alert("Speech recognition is not supported in this browser.");
    }
  }, []);

  useEffect(() => {
    fetchVoiceNotes();
  }, []);

  const toggleRecording = () => {
    if (isRecording) {
      recognition.current.stop();
    } else {
      setTranscript("");
      setFinalTranscript("");
      recognition.current.start();
    }
    setIsRecording(!isRecording);
  };

  const saveTranscript = async () => {
    if (!finalTranscript) return;

    if (!title.trim()) {
      alert("Please provide a title for your voice note");
      return;
    }

    try {
      await createVoiceNote({ title, transcript: finalTranscript });
      setTitle("");
      setTranscript("");
      setFinalTranscript("");
      fetchVoiceNotes();
    } catch (err) {
      console.error("Error saving note:", err);
    }
  };

  const fetchVoiceNotes = async () => {
    try {
      const response = await getVoiceNotes();
      setVoiceNotes(response.data);
    } catch (error) {
      console.error("Failed to fetch voice notes:", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this voice note?")) {
      try {
        await deleteVoiceNote(id);
        fetchVoiceNotes();
      } catch (error) {
        console.error("Failed to delete voice note:", error);
      }
    }
  };

  return (
    <div className="container mx-auto py-12 px-6 max-w-7xl">
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-10">
        Voice Notes
      </h1>

      {/* Record Note Section */}
      <div className="bg-white p-6 rounded-xl shadow-lg mb-10 border border-gray-100">
        <h2 className="text-2xl font-semibold mb-5 text-gray-700 border-b pb-2">
          Record a New Voice Note
        </h2>
        <input
          type="text"
          placeholder="Enter note title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          className={`w-full flex items-center justify-center ${
            isRecording
              ? "bg-red-600 hover:bg-red-700"
              : "bg-blue-600 hover:bg-blue-700"
          } text-white px-5 py-3 rounded-md transition-colors ${
            isRecording ? "animate-pulse" : ""
          }`}
          onClick={toggleRecording}
        >
          {isRecording ? (
            <>
              <FaStop className="mr-2" /> Stop Recording
            </>
          ) : (
            <>
              <FaMicrophone className="mr-2" /> Start Recording
            </>
          )}
        </button>
        {finalTranscript && (
          <button
            className="w-full mt-4 flex items-center justify-center bg-green-600 text-white px-5 py-3 rounded-md hover:bg-green-700 transition-colors"
            onClick={saveTranscript}
          >
            <FaSave className="mr-2" /> Save Note
          </button>
        )}
      </div>

      {/* Transcript Display */}
      {transcript && (
        <div className="bg-white p-6 rounded-xl shadow-md mb-8 border border-gray-100">
          <h3 className="text-xl font-semibold mb-3 text-gray-800 border-b pb-2">
            Current Transcript
          </h3>
          <p className="text-gray-600 whitespace-pre-wrap">{transcript}</p>
        </div>
      )}

      {/* Notes Display Section */}
      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-6 text-gray-700 border-b pb-2">
          Your Voice Notes
        </h2>
        {voiceNotes.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl shadow-md border border-gray-100">
            <p className="text-gray-500 text-lg">No voice notes found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {voiceNotes.map((note) => (
              <div
                key={note._id}
                className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow border border-gray-100"
              >
                <h3 className="text-xl font-semibold mb-3 text-gray-800">
                  {note.title}
                </h3>
                <div className="border-t border-b border-gray-100 py-3 my-3">
                  <p className="text-gray-600 whitespace-pre-wrap">
                    {note.transcript}
                  </p>
                </div>
                <div className="flex mt-4">
                  <button
                    className="flex-1 flex items-center justify-center bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors"
                    onClick={() => handleDelete(note._id)}
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

export default VoiceNotes;
