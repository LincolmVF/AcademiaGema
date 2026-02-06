import React from 'react';
import { Trophy, Activity, CalendarCheck } from 'lucide-react';

const StudentStats = ({ attendance }) => {
  const total = attendance.length;
  const presentes = attendance.filter(a => a.estado === 'PRESENTE').length;
  const porcentaje = total > 0 ? Math.round((presentes / total) * 100) : 0;

  return (
    <div className="grid grid-cols-3 gap-4 mb-8">
      <div className="bg-white p-5 rounded-3xl shadow-lg border border-slate-100 flex flex-col items-center group transition-all">
        <div className="bg-blue-50 p-3 rounded-2xl mb-2 text-[#1e3a8a] group-hover:bg-[#1e3a8a] group-hover:text-white transition-colors">
          <CalendarCheck size={20} />
        </div>
        <span className="text-2xl font-black text-[#1e3a8a]">{porcentaje}%</span>
        <span className="text-[9px] text-slate-400 font-black uppercase tracking-widest">Asistencia Real</span>
      </div>

      <div className="bg-white p-5 rounded-3xl shadow-lg border border-slate-100 flex flex-col items-center group transition-all">
        <div className="bg-orange-50 p-3 rounded-2xl mb-2 text-orange-600 group-hover:bg-orange-500 group-hover:text-white transition-colors">
          <Trophy size={20} />
        </div>
        <span className="text-2xl font-black text-[#1e3a8a]">{presentes}</span>
        <span className="text-[9px] text-slate-400 font-black uppercase tracking-widest">Sesiones Logradas</span>
      </div>

      <div className="bg-white p-5 rounded-3xl shadow-lg border border-slate-100 flex flex-col items-center group transition-all">
        <div className="bg-indigo-50 p-3 rounded-2xl mb-2 text-indigo-700 group-hover:bg-[#0f172a] group-hover:text-white transition-colors">
          <Activity size={20} />
        </div>
        <span className="text-2xl font-black text-[#1e3a8a]">A+</span>
        <span className="text-[9px] text-slate-400 font-black uppercase tracking-widest">Status</span>
      </div>
    </div>
  );
};

export default StudentStats;