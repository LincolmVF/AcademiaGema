import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Trophy } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

import StudentStats from '../components/student/StudentStats';
import StudentSchedule from '../components/student/StudentSchedule';
import StudentAnnouncements from '../components/student/StudentAnnouncements';
import StudentPayments from '../components/student/StudentPayments';

const DashboardEstudiante = () => {
  const { user } = useAuth();

  const firstName = user?.nombres || 'Campeón';
  const fullName = user ? `${user.nombres} ${user.apellidos}` : 'Alumno Gema';
  const initial = user?.nombres?.charAt(0).toUpperCase() || 'G';
  const userRole = user?.rol || 'Alumno';

  return (
    <div className="min-h-screen bg-[#f1f5f9] flex justify-center relative overflow-hidden">

      {/* Marca de agua */}
      <div className="absolute top-0 right-0 p-10 opacity-[0.03] pointer-events-none hidden xl:block">
        <img src="/logo.png" alt="" className="w-96 h-auto rotate-12" />
      </div>

      <div className="w-full md:max-w-6xl p-4 md:p-8 pb-28 relative z-10">

        {/* --- HEADER (Sin cambios) --- */}
        <header className="flex justify-between items-start mb-10 mt-2 bg-white md:bg-transparent p-5 md:p-0 rounded-3xl shadow-xl shadow-slate-200/50 md:shadow-none border border-slate-100 md:border-none">
          <div>
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-slate-400 hover:text-[#1e3a8a] transition-all mb-4 text-xs font-black uppercase tracking-widest group"
            >
              <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
              Volver al Inicio
            </Link>

            <h1 className="text-3xl md:text-4xl font-black text-[#1e3a8a] tracking-tighter uppercase italic">
              Hola, <span className="text-orange-500">{firstName}</span> 👋
            </h1>
            <div className="h-1.5 w-20 bg-orange-500 rounded-full mt-2 shadow-[0_2px_10px_rgba(249,115,22,0.3)]"></div>
            <p className="text-sm md:text-base text-slate-500 font-bold mt-3 italic">Academia Gema · Centro de Alto Rendimiento</p>
          </div>

          <div className="flex items-center gap-4 mt-4 md:mt-0 group cursor-pointer">
            <div className="hidden md:block text-right">
              <span className="block font-black text-[#1e3a8a] uppercase tracking-tight leading-tight group-hover:text-orange-600 transition-colors">
                {fullName}
              </span>
              <span className="inline-block px-2 py-0.5 bg-orange-100 text-orange-600 text-[10px] font-black uppercase tracking-widest rounded-md mt-1">
                {userRole}
              </span>
            </div>

            <div className="relative">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-[#1e40af] to-[#0f172a] rounded-2xl flex items-center justify-center text-white font-black shadow-lg shadow-blue-900/30 border-2 border-white group-hover:rotate-6 transition-all text-xl">
                {initial}
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
            </div>
          </div>
        </header>

        {/* --- ESTADÍSTICAS --- */}
        <div className="mb-10">
          <StudentStats />
        </div>

        {/* --- LAYOUT GRID AJUSTADO --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch"> {/* Items stretch para igualar alturas */}

          {/* COLUMNA IZQUIERDA: Horario (Ahora ocupa toda la altura disponible) */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/60 border border-slate-100 overflow-hidden h-full flex flex-col">
              <div className="px-8 py-6 border-b border-slate-100 flex items-center gap-3 bg-gradient-to-r from-white to-slate-50">
                <div className="w-2 h-8 bg-[#1e3a8a] rounded-full"></div>
                <h2 className="font-black text-[#1e3a8a] uppercase tracking-tight text-lg">Mi Horario de Entrenamiento</h2>
              </div>
              <div className="p-2 flex-grow"> {/* flex-grow para que el contenido use el espacio extra */}
                <StudentSchedule />
              </div>
            </div>
          </div>

          {/* COLUMNA DERECHA: Anuncios y Pagos agrupados */}
          <div className="space-y-8 h-full">
            <div className="bg-white p-6 rounded-3xl shadow-xl shadow-slate-200/60 border border-slate-100 h-full flex flex-col">
              {/* Sección Anuncios */}
              <div className="flex items-center gap-2 mb-6 text-[#1e3a8a]">
                <Trophy size={20} className="text-orange-500" />
                <h2 className="font-black uppercase tracking-tighter">Novedades Gema</h2>
              </div>

              <div className="flex-grow">
                <StudentAnnouncements />
              </div>

              {/* Sección Pagos */}
              <div className="mt-8 pt-8 border-t border-slate-100">
                <div className="flex items-center gap-2 mb-4 text-[#1e3a8a]">
                  <h2 className="font-black uppercase tracking-tighter">Estado de Cuenta</h2>
                </div>
                <StudentPayments />
              </div>
            </div>
          </div>

        </div>

        <p className="mt-12 text-center text-[10px] text-slate-300 font-black uppercase tracking-[0.4em] opacity-50">
          High Performance Management · Club Gema
        </p>

      </div>
    </div>
  );
};

export default DashboardEstudiante;