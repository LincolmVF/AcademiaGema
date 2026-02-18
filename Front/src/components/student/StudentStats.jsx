import React, { useMemo } from 'react';
import { CalendarCheck, History, AlertCircle } from 'lucide-react';

const StudentStats = ({ attendance }) => {
  const stats = useMemo(() => {
    const total = attendance.length;
    const asistidas = attendance.filter(a => a.estado === 'ASISTIO').length;
    const faltasRecuperables = attendance.filter(a => a.estado === 'FALTO' && !a.recuperada).length;
    
    const porcentaje = total > 0 ? Math.round((asistidas / total) * 100) : 0;

    return {
      porcentaje,
      faltasRecuperables,
      totalSesiones: total
    };
  }, [attendance]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
      {/* Tarjeta de Asistencia Real */}
      <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-5">
        <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 shadow-inner">
          <CalendarCheck size={28} />
        </div>
        <div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">
            Asistencia Real
          </p>
          <h3 className="text-3xl font-black text-[#1e3a8a] italic">
            {stats.porcentaje}%
          </h3>
        </div>
      </div>

      {/* Tarjeta de Faltas Recuperables */}
      <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-5">
        <div className="w-14 h-14 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-600 shadow-inner">
          <History size={28} />
        </div>
        <div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">
            Faltas Recuperables
          </p>
          <div className="flex items-end gap-2">
            <h3 className="text-3xl font-black text-[#1e3a8a] italic">
              {stats.faltasRecuperables}
            </h3>
            <span className="text-[10px] font-bold text-orange-500 uppercase mb-1.5 italic">
              Clases pendientes
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentStats;