import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./layout/layout";
import Home from "./pages/Home";
import HandwrittenNotes from "./pages/HandwrittenNotes";
import VoiceNotes from "./pages/VoiceNotes";
import StructuredText from "./pages/StructuredText";
import Folders from "./pages/Folders";
import RegisterScreen from "./pages/RegisterScreen";
import LoginScreen from "./pages/LoginScreen";
import ProfileScreen from "./pages/ProfileScreen";
import AdminDashboard from "./pages/AdminDashboard";
import PrivateRoute from "./PrivateRoute";
import AdminRoute from "./AdminRoute";

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Wrap all routes inside Layout */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="handwritten" element={<HandwrittenNotes />} />
          <Route path="voice" element={<VoiceNotes />} />
          <Route path="structured" element={<StructuredText />} />
          <Route path="folders" element={<Folders />} />
          <Route path="register" element={<RegisterScreen />} />
          <Route path="login" element={<LoginScreen />} />

          <Route path="" element={<PrivateRoute />}>
            <Route path="/profile" element={<ProfileScreen />} />
          </Route>

          <Route path="" element={<AdminRoute />}>
            <Route path="/admin" element={<AdminDashboard />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
