import React from 'react';
import { Outlet } from 'react-router-dom';
import MobileNavbar from '../components/MobileNavbar';
import StudentSidebar from '../components/student/StudentSidebar';

const StudentLayout = () => {
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