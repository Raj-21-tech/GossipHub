import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import AuthPage from "./pages/AuthPage";
import Chat from "./pages/Chat";

function App() {
  const isLoggedIn = localStorage.getItem("username");

  return (
    <Router>
      <Routes>
        <Route path="/" element={<AuthPage />} />
        <Route
          path="/chat"
          element={isLoggedIn ? <Chat /> : <Navigate to="/" replace />}
        />
      </Routes>
    </Router>
  );
}

export default App;
