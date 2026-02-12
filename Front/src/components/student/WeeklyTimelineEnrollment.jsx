import React from 'react';
import { Clock, CalendarCheck } from 'lucide-react';

const WeeklyTimelineEnrollment = ({ agendaSeleccionada = [] }) => {
  const diasSemana = [
    { id: 1, label: 'LUN' }, { id: 2, label: 'MAR' }, { id: 3, label: 'MIE' },
    { id: 4, label: 'JUE' }, { id: 5, label: 'VIE' }, { id: 6, label: 'SAB' }
  ];

  const startDay = 8; // 08:00
  const endDay = 22;  // 22:00

  const getPosition = (timeStr) => {
    if (!timeStr) return 0;
    const [hrs, mins] = timeStr.split(':').map(Number);
    const totalMins = (hrs * 60) + mins;
    return ((totalMins - (startDay * 60)) / ((endDay - startDay) * 60)) * 100;
  };

  return (
    <section className="mb-12 bg-[#0f172a] rounded-[3rem] p-8 shadow-2xl border border-white/5 relative overflow-hidden animate-fade-in">
      <div className="flex items-center justify-between mb-8 relative z-10">
        <div>
          <h2 className="flex items-center gap-3 text-lg font-black italic uppercase tracking-[0.2em] text-orange-500">
            <CalendarCheck size={24} className="animate-pulse" /> GEMA PLANNER
          </h2>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1 italic">Organiza tu horario de entrenamiento</p>
        </div>
        <div className="text-[10px] font-black text-white/40 uppercase italic flex items-center gap-2">
          <Clock size={12}/> 08:00 - 22:00
        </div>
      </div>

      <div className="grid grid-cols-6 gap-4 h-72 relative z-10">
        {diasSemana.map((dia) => {
          // Filtra por dia_semana como número (1, 2, 3...) que viene del GET /horarios
          const clasesDelDia = agendaSeleccionada.filter(h => h.dia_semana === dia.id);
          
          return (
            <div key={dia.id} className="relative flex flex-col items-center h-full group">
              <span className="text-[10px] font-black text-slate-500 mb-4 group-hover:text-white transition-colors uppercase italic">{dia.label}</span>
              <div className="w-full flex-1 bg-white/[0.03] rounded-2xl relative border border-white/5 overflow-hidden backdrop-blur-sm">
                {clasesDelDia.map((clase) => {
                  const top = getPosition(clase.hora_inicio);
                  const bottom = getPosition(clase.hora_fin);
                  const height = Math.max(bottom - top, 20);

                  return (
                    <div
                      key={clase.id}
                      className="absolute left-1 right-1 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 p-2 shadow-lg border border-white/20 flex flex-col justify-center animate-zoom-in"
                      style={{ top: `${top}%`, height: `${height}%` }}
                    >
                      <span className="text-[9px] font-black text-white leading-none uppercase italic truncate">
                        {clase.nivel?.nombre || 'TÉCNICO'}
                      </span>
                      <span className="text-[7px] font-bold text-orange-100 opacity-90 mt-1">
                        {clase.hora_inicio} - {clase.hora_fin}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default WeeklyTimelineEnrollment;