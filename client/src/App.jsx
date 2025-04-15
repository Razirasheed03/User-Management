import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './Components/Common/ProtectedRoute';
import Home from './Pages/User/Home';
import Login from './Pages/User/Login';
import Profile from './Pages/User/Profile';
import Navbar from './Components/Common/Navbar';
import Register from './Pages/User/Register';
import AdminDashboard from './Pages/Admin/adminDashboard';
import { useSelector } from 'react-redux';

const App = () => {
  const { user } = useSelector((state) => state.auth);

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route path="/register" element={<Register />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute adminOnly={true}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin-dashboard"
          element={
            user?.isAdmin ? <AdminDashboard /> : <Navigate to="/" />
          }
        />
      </Routes>
    </>
  );
};

export default App;
