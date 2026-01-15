import React from 'react';
import { Trophy, Activity, CalendarCheck } from 'lucide-react'; // O usa emojis 🏆 📈 ✅

const StudentStats = () => {
  return (
    <div className="grid grid-cols-3 gap-3 mb-6">
      
      {/* Tarjeta 1: Asistencia */}
      <div className="bg-white p-3 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center">
        <div className="bg-green-100 p-2 rounded-full mb-2 text-green-600">
          <CalendarCheck size={20} />
        </div>
        <span className="text-2xl font-bold text-gray-800">92%</span>
        <span className="text-[10px] text-gray-500 font-medium uppercase tracking-wide">Asistencia</span>
      </div>

      {/* Tarjeta 2: Partidos Jugados */}
      <div className="bg-white p-3 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center">
        <div className="bg-orange-100 p-2 rounded-full mb-2 text-orange-600">
          <Trophy size={20} />
        </div>
        <span className="text-2xl font-bold text-gray-800">14</span>
        <span className="text-[10px] text-gray-500 font-medium uppercase tracking-wide">Partidos</span>
      </div>

      {/* Tarjeta 3: Rendimiento */}
      <div className="bg-white p-3 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center">
        <div className="bg-blue-100 p-2 rounded-full mb-2 text-blue-600">
          <Activity size={20} />
        </div>
        <span className="text-2xl font-bold text-gray-800">8.5</span>
        <span className="text-[10px] text-gray-500 font-medium uppercase tracking-wide">Rendimiento</span>
      </div>

    </div>
  );
};

export default StudentStats;