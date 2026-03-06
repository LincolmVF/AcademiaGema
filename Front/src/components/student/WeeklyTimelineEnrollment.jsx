import React from 'react';
import { Clock, CalendarCheck } from 'lucide-react';

const WeeklyTimelineEnrollment = ({ agendaSeleccionada = [] }) => {
  const diasSemana = [
    { id: 1, label: 'LUN' }, { id: 2, label: 'MAR' }, { id: 3, label: 'MIE' },
    { id: 4, label: 'JUE' }, { id: 5, label: 'VIE' }, { id: 6, label: 'SAB' }
  ];

  // Rango extendido para cubrir clases de 10 a 12 PM
  const startDay = 8;  // 08:00
  const endDay = 24;   // 00:00 (Medianoche)

  const getPosition = (timeStr) => {
    if (!timeStr) return 0;
    const [hrs, mins] = timeStr.split(':').map(Number);
    // Ajuste para horas que son exactamente 00:00 del día siguiente
    const normalizedHrs = hrs === 0 ? 24 : hrs;
    const totalMins = (normalizedHrs * 60) + mins;
    const position = ((totalMins - (startDay * 60)) / ((endDay - startDay) * 60)) * 100;
    return Math.min(Math.max(position, 0), 100);
  };

  return (
    <section className="mb-6 md:mb-12 bg-[#0f172a] rounded-2xl md:rounded-[3rem] p-4 md:p-8 shadow-2xl border border-white/5 relative overflow-hidden animate-fade-in">
      {/* Header Responsivo */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 md:mb-8 relative z-10 gap-4">
        <div>
          <h2 className="flex items-center gap-2 md:gap-3 text-sm md:text-lg font-black italic uppercase tracking-[0.1em] md:tracking-[0.2em] text-orange-500">
            <CalendarCheck size={20} className="animate-pulse md:w-6 md:h-6" /> GEMA PLANNER
          </h2>
          <p className="text-[8px] md:text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1 italic">
            Organiza tu horario de entrenamiento
          </p>
        </div>
        <div className="text-[9px] md:text-[10px] font-black text-white/40 uppercase italic flex items-center gap-2 bg-white/5 self-start px-3 py-1 rounded-full border border-white/10">
          <Clock size={12} /> 08:00 - 00:00
        </div>
      </div>

      {/* Contenedor del Calendario con Scroll en Móvil */}
      <div className="relative z-10 overflow-x-auto pb-4 custom-scrollbar">
        <div className="grid grid-cols-6 gap-2 md:gap-4 min-w-[600px] md:min-w-full h-[400px] md:h-[500px]">
          {diasSemana.map((dia) => {
            const clasesDelDia = agendaSeleccionada.filter(h => Number(h.dia_semana) === dia.id);

            return (
              <div key={dia.id} className="relative flex flex-col items-center h-full group">
                <span className="text-[9px] md:text-[10px] font-black text-slate-500 mb-2 md:mb-4 group-hover:text-white transition-colors uppercase italic tracking-tighter md:tracking-normal">
                  {dia.label}
                </span>

                <div className="w-full flex-1 bg-white/[0.02] rounded-xl md:rounded-2xl relative border border-white/5 overflow-hidden backdrop-blur-sm">
                  {/* Líneas de referencia horaria (opcional para mejor guía visual) */}
                  <div className="absolute inset-0 pointer-events-none opacity-20">
                    {[12, 16, 20].map(h => (
                      <div
                        key={h}
                        className="absolute w-full border-t border-white/10"
                        style={{ top: `${getPosition(`${h}:00`)}%` }}
                      />
                    ))}
                  </div>

                  {clasesDelDia.map((clase) => {
                    const top = getPosition(clase.hora_inicio);
                    const bottom = getPosition(clase.hora_fin);
                    const height = Math.max(bottom - top, 15); // Mínimo de altura para visibilidad

                    return (
                      <div
                        key={clase.id}
                        className="absolute left-0.5 right-0.5 md:left-1 md:right-1 rounded-lg md:rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 p-1 md:p-2 shadow-lg border border-white/20 flex flex-col justify-center animate-zoom-in hover:scale-[1.02] transition-transform cursor-default z-20"
                        style={{ top: `${top}%`, height: `${height}%` }}
                      >
                        <span className="text-[7px] md:text-[9px] font-black text-white leading-none uppercase italic truncate block">
                          {clase.nivel?.nombre || 'CLASE'}
                        </span>
                        <span className="text-[6px] md:text-[7px] font-bold text-orange-100 opacity-90 mt-0.5 md:mt-1 whitespace-nowrap">
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
      </div>

      {/* Decoración de fondo */}
      <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-orange-500/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute -left-20 -top-20 w-64 h-64 bg-blue-500/5 rounded-full blur-[100px] pointer-events-none" />
    </section>
  );
};

export default WeeklyTimelineEnrollment;