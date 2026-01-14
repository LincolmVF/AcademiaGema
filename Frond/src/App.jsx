import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import DashboardLayout from './layouts/DashboardLayout';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />

        {/* Rutas Protegidas (Dashboard) */}
        <Route path="/dashboard" element={<DashboardLayout />}>

          {/* Ruta por defecto */}
          <Route index element={<Navigate to="/dashboard/student" replace />} />

          <Route path="admin" element={<Dashboard role="admin" />} />
          <Route path="teacher" element={<Dashboard role="teacher" />} />
          <Route path="student" element={<Dashboard role="student" />} />

        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;