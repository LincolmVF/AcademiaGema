import React from 'react';
import { Clock, CalendarCheck, MapPin } from 'lucide-react';

const WeeklyTimelineEnrollment = ({ agendaSeleccionada = [] }) => {
  const diasSemana = [
    { id: 1, label: 'Lunes', short: 'LUN' },
    { id: 2, label: 'Martes', short: 'MAR' },
    { id: 3, label: 'Miércoles', short: 'MIE' },
    { id: 4, label: 'Jueves', short: 'JUE' },
    { id: 5, label: 'Viernes', short: 'VIE' },
    { id: 6, label: 'Sábado', short: 'SAB' }
  ];

  const startDay = 8;  // 08:00
  const endDay = 24;   // 00:00
  const totalHours = endDay - startDay;

  // Horas para la columna lateral
  const hoursRange = Array.from({ length: totalHours + 1 }, (_, i) => startDay + i);

  const getPosition = (timeStr) => {
    if (!timeStr) return 0;
    const [hrs, mins] = timeStr.split(':').map(Number);
    const normalizedHrs = hrs === 0 ? 24 : hrs;
    const totalMins = (normalizedHrs * 60) + mins;
    return ((totalMins - (startDay * 60)) / (totalHours * 60)) * 100;
  };

  return (
    <section className="mb-12 bg-[#020617] rounded-[2.5rem] p-1 shadow-2xl border border-white/5 relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="p-6 md:p-10 relative z-10">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20">
              <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
              <span className="text-[10px] font-black text-orange-500 uppercase tracking-[0.2em]">Live Schedule</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black italic text-white uppercase tracking-tighter leading-none">
              GEMA <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">PLANNER</span>
            </h2>
          </div>
          <div className="flex items-center gap-4 bg-white/5 p-2 rounded-2xl border border-white/10 backdrop-blur-md">
            <div className="text-right hidden sm:block">
              <p className="text-[10px] font-bold text-slate-500 uppercase italic">Rango de Operación</p>
              <p className="text-xs font-black text-white italic">08:00 AM — 12:00 PM</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-orange-500 flex items-center justify-center shadow-lg shadow-orange-500/20">
              <Clock className="text-white" size={20} />
            </div>
          </div>
        </div>

        {/* Calendar Container */}
        <div className="relative flex overflow-x-auto pb-6 custom-scrollbar group">

          {/* Columnas de Horas (Gutter) */}
          <div className="flex-none w-12 pt-14 pr-4 border-r border-white/5 sticky left-0 bg-[#020617]/80 backdrop-blur-sm z-30">
            {hoursRange.map((hour) => (
              <div
                key={hour}
                className="text-[9px] font-black text-slate-600 h-[40px] flex items-start justify-end italic"
                style={{ height: `${100 / totalHours}%` }}
              >
                {hour > 12 ? `${hour - 12}PM` : `${hour}AM`}
              </div>
            ))}
          </div>

          {/* Grid de Días */}
          <div className="flex-grow grid grid-cols-6 min-w-[850px] gap-px bg-white/5 rounded-3xl overflow-hidden border border-white/5">
            {diasSemana.map((dia) => {
              const clasesDelDia = agendaSeleccionada.filter(h => Number(h.dia_semana) === dia.id);

              return (
                <div key={dia.id} className="relative bg-[#020617]/40 min-h-[600px] group/day">
                  {/* Header del Día */}
                  <div className="h-14 flex flex-col items-center justify-center border-b border-white/5 bg-white/[0.02]">
                    <span className="text-[11px] font-black text-white italic uppercase tracking-widest">{dia.label}</span>
                    <span className="text-[8px] font-bold text-slate-500 uppercase tracking-tighter">{dia.short}</span>
                  </div>

                  {/* Espacio de Clases */}
                  <div className="relative h-full p-1">
                    {/* Líneas de Fondo */}
                    {hoursRange.map((_, i) => (
                      <div key={i} className="absolute w-full border-t border-white/[0.03]" style={{ top: `${(i / totalHours) * 100}%` }} />
                    ))}

                    {clasesDelDia.map((clase) => {
                      const top = getPosition(clase.hora_inicio);
                      const bottom = getPosition(clase.hora_fin);
                      const height = Math.max(bottom - top, 12);

                      return (
                        <div
                          key={clase.id}
                          className="absolute left-1 right-1 rounded-2xl overflow-hidden group/item transition-all duration-300 hover:z-40 hover:scale-[1.02]"
                          style={{ top: `${top}%`, height: `${height}%` }}
                        >
                          <div className="absolute inset-0 bg-gradient-to-br from-orange-500 to-orange-700 opacity-90 shadow-xl" />

                          {/* Contenido de la Clase */}
                          <div className="relative p-2 h-full flex flex-col justify-between border border-white/20">
                            <div>
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-[8px] font-black text-white italic uppercase leading-none truncate pr-1">
                                  {clase.nivel?.nombre || 'PRO'}
                                </span>
                                <div className="p-0.5 bg-black/20 rounded-md">
                                  <MapPin size={8} className="text-white" />
                                </div>
                              </div>
                              <p className="text-[7px] font-bold text-orange-100/80 leading-tight">
                                {clase.hora_inicio}
                              </p>
                            </div>

                            {height > 15 && (
                              <div className="pt-1 border-t border-white/10 mt-1">
                                <p className="text-[6px] font-black text-white/60 uppercase">Finaliza {clase.hora_fin}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-8 flex flex-wrap gap-6 border-t border-white/5 pt-8">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.5)]" />
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic">Clases Confirmadas</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-white/10 border border-white/20" />
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic">Espacios Libres</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WeeklyTimelineEnrollment;