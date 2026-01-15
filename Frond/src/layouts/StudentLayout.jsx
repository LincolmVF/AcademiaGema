// src/layouts/StudentLayout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import MobileNavbar from '../components/MobileNavbar';

const StudentLayout = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      
      {/* ANTES: className="w-full max-w-md pb-24 relative"
         PROBLEMA: El 'max-w-md' forzaba a que SIEMPRE fuera tamaño celular.
      */}

      {/* AHORA: Usamos 'w-full' para que ocupe toda la pantalla. 
          El componente interno (DashboardEstudiante) es el que decidirá 
          cuándo frenar su ancho (con max-w-6xl). 
      */}
      <div className="w-full pb-24 relative"> 
        
        {/* Aquí se carga tu DashboardEstudiante (que ya tiene el Grid configurado) */}
        <Outlet />

        {/* El menú flotante sigue abajo */}
        <MobileNavbar />
        
      </div>
    </div>
  );
};

export default StudentLayout;