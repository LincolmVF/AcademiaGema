// src/pages/DashboardEstudiante.jsx
import React from 'react';
import { Link } from 'react-router-dom'; // <--- 1. IMPORTAR ESTO
import { ArrowLeft } from 'lucide-react'; // <--- 2. IMPORTAR ESTO (Si usas iconos)

import StudentStats from '../components/student/StudentStats';
import StudentSchedule from '../components/student/StudentSchedule';
import StudentAnnouncements from '../components/student/StudentAnnouncements';
import StudentPayments from '../components/student/StudentPayments';

const DashboardEstudiante = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-slate-100 flex justify-center">
      
      <div className="w-full md:max-w-6xl p-4 md:p-8 pb-28">
        
        {/* --- HEADER --- */}
        <header className="flex justify-between items-start mb-8 mt-2 bg-white md:bg-transparent p-4 md:p-0 rounded-xl shadow-sm md:shadow-none">
          <div>
            
            {/* --- 3. BOTÓN NUEVO AQUÍ --- */}
            <Link 
              to="/" 
              className="inline-flex items-center gap-1 text-gray-400 hover:text-blue-600 transition-colors mb-2 text-sm font-medium group"
            >
              <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
              Volver al Inicio
            </Link>
            {/* --------------------------- */}

            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">Hola, Campeón 👋</h1>
            <p className="text-sm md:text-base text-gray-500 font-medium">Academia "El Remate"</p>
          </div>
          
          <div className="flex items-center gap-3 mt-4 md:mt-0"> {/* Ajuste de margen para alinear con el botón nuevo */}
             {/* Oculto el texto en celular, visible en PC */}
            <span className="hidden md:block text-right text-sm text-gray-600">
              <span className="block font-bold">Juan Mercado</span>
              <span className="text-xs">Sub-17</span>
            </span>
            <div className="w-11 h-11 md:w-14 md:h-14 bg-gradient-to-tr from-blue-600 to-blue-400 rounded-full flex items-center justify-center text-white font-bold shadow-lg shadow-blue-200 text-lg">
              JM
            </div>
          </div>
        </header>

        {/* --- ESTADÍSTICAS --- */}
        <div className="mb-8">
           <StudentStats />
        </div>

        {/* --- LAYOUT GRID --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* COLUMNA IZQUIERDA */}
          <div className="lg:col-span-2 space-y-6">
             <StudentSchedule />
          </div>

          {/* COLUMNA DERECHA */}
          <div className="space-y-8">
             <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 md:sticky md:top-8">
                <StudentAnnouncements />
                <div className="mt-8 pt-8 border-t border-gray-100">
                   <StudentPayments />
                </div>
             </div>
          </div>

        </div>
        
      </div>
    </div>
  );
};

export default DashboardEstudiante;