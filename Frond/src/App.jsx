// src/App.jsx
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';

// Importamos AMBOS Layouts
import DashboardLayout from './layouts/DashboardLayout'; // Layout Admin (PC/Sidebar)
import StudentLayout from './layouts/StudentLayout';     // Layout Estudiante (Móvil)

// Importamos las páginas
import Dashboard from './pages/Dashboard';             // Página genérica (Admin/Teacher)
import DashboardEstudiante from './pages/DashboardEstudiante'; // Página diseño nuevo (Estudiante)

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />

        {/* TRUCO CLAVE: 
           La ruta padre "/dashboard" YA NO TIENE 'element={...}'.
           Así no fuerza ningún layout por defecto.
        */}
        <Route path="/dashboard">

          {/* GRUPO 1: ESTUDIANTE -> Usa StudentLayout */}
          <Route element={<StudentLayout />}>
            <Route path="student" element={<DashboardEstudiante />} />
            {/* Si entran a /dashboard directo, los mandamos al estudiante */}
            <Route index element={<Navigate to="/dashboard/student" replace />} />
          </Route>

          {/* GRUPO 2: ADMIN/PROFE -> Usa DashboardLayout */}
          <Route element={<DashboardLayout />}>
            <Route path="admin" element={<Dashboard role="admin" />} />
            <Route path="teacher" element={<Dashboard role="teacher" />} />
          </Route>

        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;