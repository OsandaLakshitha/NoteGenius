import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import HandwrittenNotes from './pages/HandwrittenNotes';
import VoiceNotes from './pages/VoiceNotes';
import StructuredText from './pages/StructuredText';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/handwritten" element={<HandwrittenNotes />} />
        <Route path="/voice" element={<VoiceNotes />} />
        <Route path="/structured" element={<StructuredText />} />
      </Routes>
    </Router>
  );
};

export default App;