import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import PlaylistDetail from './components/PlaylistDetail';
import CreatePlaylist from './components/CreatePlaylist';
import NotFound from './components/NotFound';
import PrivateRoute from './components/PrivateRoute';
import './App.css'; // Keep this if you have global styles, otherwise remove

function App() {
  return (
    <Router>
      <div className="bg-[#191414] min-h-screen text-white">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/create-playlist"
            element={
              <PrivateRoute>
                <CreatePlaylist />
              </PrivateRoute>
            }
          />
          <Route
            path="/playlist/:id"
            element={
              <PrivateRoute>
                <PlaylistDetail />
              </PrivateRoute>
            }
          />
          <Route path="/" element={<Login />} /> {/* Default route to login page */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
