import React from 'react';
import { Trophy, Activity, CalendarCheck } from 'lucide-react';

const StudentStats = () => {
  return (
    <div className="grid grid-cols-3 gap-4 mb-8">

      {/* Tarjeta 1: Asistencia (Acento Azul Gema) */}
      <div className="bg-white p-5 rounded-3xl shadow-xl shadow-slate-200/60 border border-slate-100 flex flex-col items-center justify-center text-center group hover:-translate-y-1 transition-all duration-300">
        <div className="bg-blue-50 p-3 rounded-2xl mb-3 text-[#1e3a8a] group-hover:bg-[#1e3a8a] group-hover:text-white transition-colors duration-300 shadow-sm">
          <CalendarCheck size={22} strokeWidth={2.5} />
        </div>
        <span className="text-3xl font-black text-[#1e3a8a] tracking-tighter">92%</span>
        <span className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mt-1">Asistencia</span>
        <div className="h-1 w-6 bg-blue-200 rounded-full mt-2 group-hover:w-10 transition-all"></div>
      </div>

      {/* Tarjeta 2: Partidos Jugados (Acento Naranja Gema) */}
      <div className="bg-white p-5 rounded-3xl shadow-xl shadow-slate-200/60 border border-slate-100 flex flex-col items-center justify-center text-center group hover:-translate-y-1 transition-all duration-300">
        <div className="bg-orange-50 p-3 rounded-2xl mb-3 text-orange-600 group-hover:bg-orange-500 group-hover:text-white transition-colors duration-300 shadow-sm">
          <Trophy size={22} strokeWidth={2.5} />
        </div>
        <span className="text-3xl font-black text-[#1e3a8a] tracking-tighter">14</span>
        <span className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mt-1">Partidos</span>
        <div className="h-1 w-6 bg-orange-200 rounded-full mt-2 group-hover:w-10 transition-all"></div>
      </div>

      {/* Tarjeta 3: Rendimiento (Mezcla de Marca) */}
      <div className="bg-white p-5 rounded-3xl shadow-xl shadow-slate-200/60 border border-slate-100 flex flex-col items-center justify-center text-center group hover:-translate-y-1 transition-all duration-300">
        <div className="bg-indigo-50 p-3 rounded-2xl mb-3 text-indigo-700 group-hover:bg-[#0f172a] group-hover:text-white transition-colors duration-300 shadow-sm">
          <Activity size={22} strokeWidth={2.5} />
        </div>
        <span className="text-3xl font-black text-[#1e3a8a] tracking-tighter">8.5</span>
        <span className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mt-1">Rendimiento</span>
        <div className="h-1 w-6 bg-indigo-200 rounded-full mt-2 group-hover:w-10 transition-all"></div>
      </div>

    </div>
  );
};

export default StudentStats;