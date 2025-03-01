import React, { useState, useEffect, useRef } from 'react';
import { getVoiceNotes, createVoiceNote, deleteVoiceNote } from '../services/api';

const VoiceNotes = () => {
  const [voiceNotes, setVoiceNotes] = useState([]);
  const [title, setTitle] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [finalTranscript, setFinalTranscript] = useState('');
  const recognition = useRef(null);

  // Initialize speech recognition
  useEffect(() => {
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognition.current = new SpeechRecognition();
      recognition.current.continuous = false;
      recognition.current.interimResults = false;
      recognition.current.lang = 'en-US';

      recognition.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setTranscript(transcript);
        setFinalTranscript(transcript); // Store the final transcript
      };

      recognition.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
      };

      recognition.current.onend = () => {
        setIsRecording(false); // Ensure state updates when recording ends
      };
    } else {
      alert('Speech recognition is not supported in this browser.');
    }
  }, []);

  // Start/stop recording
  const toggleRecording = () => {
    if (isRecording) {
      recognition.current.stop();
    } else {
      setTranscript(''); // Reset transcript
      setFinalTranscript(''); // Reset final transcript
      recognition.current.start();
    }
    setIsRecording(!isRecording);
  };

  // Save transcript to backend
  const saveTranscript = async () => {
    if (!finalTranscript) return; // Don't save empty transcripts

    try {
      await createVoiceNote({ title, transcript: finalTranscript });
      setTitle('');
      setTranscript('');
      setFinalTranscript('');
      fetchVoiceNotes();
    } catch (err) {
      console.error('Error saving note:', err);
    }
  };

  // Fetch existing notes
  const fetchVoiceNotes = async () => {
    const response = await getVoiceNotes();
    setVoiceNotes(response.data);
  };

  return (
    <div className="app-container">
      <h1>Voice Notes</h1>

      {/* Recording UI */}
      <div className="recording-section">
        <input
          type="text"
          placeholder="Note Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <button
          className={`cta-button ${isRecording ? 'recording' : ''}`}
          onClick={toggleRecording}
        >
          {isRecording ? '⏹ Stop Recording' : '🎤 Start Recording'}
        </button>

        {/* Save button appears ONLY after recording stops */}
        {finalTranscript && (
          <button className="cta-button" onClick={saveTranscript}>
            💾 Save Note
          </button>
        )}
      </div>

      {/* Display real-time transcript */}
      {transcript && (
        <div className="transcript">
          <h3>Transcript:</h3>
          <p>{transcript}</p>
        </div>
      )}

      {/* List of saved notes */}
      <div className="notes-section">
        {voiceNotes.map((note) => (
          <div key={note._id} className="note-card">
            <h3>{note.title}</h3>
            <p>{note.transcript}</p>
            <button className="cta-button" onClick={() => deleteVoiceNote(note._id)}>
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VoiceNotes;