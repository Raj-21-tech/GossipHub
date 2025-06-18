// frontend/src/App.js

import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import AuthPage from "./pages/AuthPage";
import Chat from "./pages/Chat";

function App() {
  const token = localStorage.getItem("token");

  return (
    <Router>
      <Routes>
        {/* Public route for login/register */}
        <Route path="/" element={<AuthPage />} />

        {/* Protected route for chat */}
        <Route
          path="/chat"
          element={token ? <Chat /> : <Navigate to="/" replace />}
        />

        {/* Catch-all: redirect to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;

