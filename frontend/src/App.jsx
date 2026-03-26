import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Login from './components/Login';
import Dashboard from './components/Dashboard';

function App() {
  // Sistem Auth Dummy sederhana via Session Token (Local Storage String)
  const [token, setToken] = useState(localStorage.getItem('token'));

  // Komponen Wrapper Proteksi Route
  const ProtectedRoute = ({ children }) => {
    if (!token) {
      // Tendang kembali ke halaman awal jika belum pegang Token JWT
      return <Navigate to="/login" replace />;
    }
    return children;
  };

  return (
    <Router>
      <Toaster 
        position="top-center" 
        toastOptions={{ 
          style: { fontFamily: 'Inter, sans-serif', fontSize: '14px', fontWeight: 500 }
        }} 
      />
      <Routes>
        <Route 
          path="/login" 
          element={!token ? <Login setToken={setToken}/> : <Navigate to="/" replace />} 
        />
        <Route 
          path="/" 
          element={
            <ProtectedRoute>
              <Dashboard setToken={setToken}/>
            </ProtectedRoute>
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;
