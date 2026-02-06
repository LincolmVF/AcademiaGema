import React from 'react';
import { Clock, MapPin, User, CheckCircle2 } from 'lucide-react';

const StudentEnrollment = ({ schedule, isSelected, onSelect }) => {
  const days = ["", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];

  return (
    <div 
      onClick={() => onSelect(schedule.id)}
      className={`relative p-6 rounded-[2.5rem] border-2 transition-all duration-500 cursor-pointer overflow-hidden group ${
        isSelected 
          ? 'border-orange-500 bg-orange-50 shadow-xl shadow-orange-200/40 scale-[1.02]' 
          : 'border-slate-100 bg-white hover:border-blue-200 hover:shadow-xl'
      }`}
    >
      {/* Indicador visual de que está seleccionado */}
      {isSelected && (
        <div className="absolute top-6 right-6 text-orange-500 animate-in zoom-in duration-300">
          <CheckCircle2 size={32} fill="currentColor" className="text-white" />
        </div>
      )}

      <div className="flex flex-col gap-5">
        <div>
          <span className="bg-[#1e3a8a] text-white text-[10px] font-black px-4 py-1.5 rounded-xl uppercase italic tracking-widest shadow-sm">
            {schedule.nivel?.nombre || 'General'}
          </span>
        </div>

        <div>
          <h3 className="text-2xl font-black text-[#1e3a8a] uppercase italic leading-none tracking-tighter">
            {days[schedule.dia_semana]}
          </h3>
          <div className="flex items-center gap-2 text-slate-400 mt-2 font-black uppercase text-[10px] tracking-widest">
            <Clock size={14} className="text-orange-500" strokeWidth={3} />
            {schedule.hora_inicio} - {schedule.hora_fin}
          </div>
        </div>

        <div className="h-px bg-gradient-to-r from-slate-100 via-slate-200 to-transparent" />

        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-50 text-[#1e3a8a] rounded-2xl group-hover:bg-[#1e3a8a] group-hover:text-white transition-all duration-300">
              <MapPin size={16} strokeWidth={2.5} />
            </div>
            <div>
              <p className="text-[9px] text-slate-400 font-black uppercase tracking-tighter text-left">Sede / Cancha</p>
              <p className="text-xs font-bold text-slate-700 text-left">{schedule.cancha?.sede?.nombre} - {schedule.cancha?.nombre}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-orange-50 text-orange-600 rounded-2xl group-hover:bg-orange-500 group-hover:text-white transition-all duration-300">
              <User size={16} strokeWidth={2.5} />
            </div>
            <div>
              <p className="text-[9px] text-slate-400 font-black uppercase tracking-tighter text-left">Entrenador</p>
              <p className="text-xs font-bold text-slate-700 text-left">{schedule.profesor?.nombre_completo}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentEnrollment;