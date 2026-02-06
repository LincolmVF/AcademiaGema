import React from 'react';
import { Outlet, Navigate, useLocation } from 'react-router-dom';
import MobileNavbar from '../components/MobileNavbar';
import { useAuth } from '../context/AuthContext';
import StudentSidebar from '../components/student/StudentSidebar';

const StudentLayout = () => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return null;

  if (!user) return <Navigate to="/login" replace />;

  const registroIncompleto = !user?.alumnos?.seguro_medico;
  const enPaginaRegistro = location.pathname === '/dashboard/student/registration';

  if (registroIncompleto && !enPaginaRegistro) {
    return <Navigate to="/dashboard/student/registration" replace />;
  }

  return (
    <div className="min-h-screen bg-slate-50">

      {/* 1. SIDEBAR (Solo visible en Desktop 'md:flex') */}
      <StudentSidebar />

      {/* 2. CONTENIDO PRINCIPAL */}
      {/* Añadimos 'md:pl-64' para dejar espacio al sidebar en PC */}
      <div className="w-full md:pl-64 pb-24 md:pb-8 relative">
        <Outlet />
      </div>

      {/* 3. NAVBAR MÓVIL (Solo visible en Móvil 'md:hidden') */}
      {/* Asegúrate de actualizar MobileNavbar con las rutas correctas también */}
      <MobileNavbar />

    </div>
  );
};

export default StudentLayout;