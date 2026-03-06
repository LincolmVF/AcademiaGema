import React from 'react';
import { Clock, CalendarCheck, MapPin, ChevronRight } from 'lucide-react';

const WeeklyTimelineEnrollment = ({ agendaSeleccionada = [] }) => {
  const diasSemana = [
    { id: 1, label: 'Lunes', short: 'LUN' },
    { id: 2, label: 'Martes', short: 'MAR' },
    { id: 3, label: 'Miércoles', short: 'MIE' },
    { id: 4, label: 'Jueves', short: 'JUE' },
    { id: 5, label: 'Viernes', short: 'VIE' },
    { id: 6, label: 'Sábado', short: 'SAB' }
  ];

  const startDay = 7;
  const endDay = 24;
  const totalHours = endDay - startDay;

  const getPosition = (timeStr) => {
    if (!timeStr) return 0;
    const [hrs, mins] = timeStr.split(':').map(Number);
    const normalizedHrs = hrs === 0 ? 24 : hrs;
    const totalMins = (normalizedHrs * 60) + mins;
    return ((totalMins - (startDay * 60)) / (totalHours * 60)) * 100;
  };

  return (
    <section className="mb-8 bg-[#020617] rounded-3xl p-1 shadow-2xl border border-white/5 relative overflow-hidden font-sans mx-auto max-w-7xl">
      {/* Glows de fondo más discretos */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-orange-600/5 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-600/5 blur-[100px] pointer-events-none" />

      <div className="p-3 md:p-6 relative z-10">
        {/* Header Compacto */}
        <div className="flex items-center justify-between mb-6 gap-4 px-2">
          <div className="space-y-0.5">
            <h2 className="text-xl md:text-3xl font-black italic text-white uppercase tracking-tighter leading-none">
              GEMA <span className="text-orange-500">PLANNER</span>
            </h2>
            <p className="text-[8px] md:text-[10px] font-bold text-slate-500 uppercase tracking-widest italic">Elite Training</p>
          </div>
          <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-xl border border-white/10 backdrop-blur-md">
            <Clock className="text-orange-500" size={14} />
            <span className="text-[10px] md:text-xs font-black text-white italic tracking-tighter">07:00 — 00:00</span>
          </div>
        </div>

        {/* Timeline Container con Scroll Horizontal en móvil */}
        <div className="relative flex overflow-x-auto pb-4 custom-scrollbar border border-white/5 rounded-2xl bg-black/20">

          {/* Gutter de Horas (Sticky) */}
          <div className="flex-none w-10 md:w-14 pt-12 border-r border-white/5 sticky left-0 bg-[#020617]/95 backdrop-blur-md z-30">
            {Array.from({ length: totalHours + 1 }).map((_, i) => (
              <div
                key={i}
                className="text-[8px] md:text-[9px] font-black text-slate-500 pr-2 flex justify-end italic"
                style={{ height: `${100 / totalHours}%`, transform: 'translateY(-50%)' }}
              >
                {startDay + i}:00
              </div>
            ))}
          </div>

          {/* Grid de Días - Altura reducida a 500px */}
          <div className="flex-grow grid grid-cols-6 min-w-[750px] md:min-w-full">
            {diasSemana.map((dia) => {
              const clasesDelDia = agendaSeleccionada.filter(h => Number(h.dia_semana) === dia.id);

              return (
                <div key={dia.id} className="relative border-r border-white/5 last:border-r-0 min-h-[500px] group/day">
                  <div className="h-12 flex items-center justify-center border-b border-white/5 bg-white/[0.01]">
                    <span className="text-[10px] md:text-[12px] font-black text-white italic uppercase">{dia.short}</span>
                  </div>

                  <div className="relative h-full px-1">
                    {/* Líneas Horizontales */}
                    {Array.from({ length: totalHours }).map((_, i) => (
                      <div key={i} className="absolute w-full border-t border-white/[0.03]" style={{ top: `${(i / totalHours) * 100}%` }} />
                    ))}

                    {clasesDelDia.map((clase) => {
                      const top = getPosition(clase.hora_inicio);
                      const bottom = getPosition(clase.hora_fin);
                      const height = bottom - top;

                      return (
                        <div
                          key={clase.id}
                          className="absolute left-1 right-1 rounded-lg overflow-hidden group/item transition-all duration-300 hover:z-40 hover:scale-[1.02] shadow-lg"
                          style={{
                            top: `${top}%`,
                            height: `${height}%`,
                            marginTop: '1.5px',
                            marginBottom: '1.5px'
                          }}
                        >
                          <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900 border border-white/10 group-hover/item:from-orange-600 group-hover/item:to-orange-700 transition-colors" />

                          <div className="relative p-1.5 h-full flex flex-col justify-between overflow-hidden">
                            <div className="flex flex-col">
                              <span className="text-[8px] md:text-[9px] font-black text-white italic uppercase truncate leading-none mb-1">
                                {clase.nivel?.nombre || 'CLASS'}
                              </span>

                              <div className="flex flex-col text-[7px] md:text-[8px] font-bold text-orange-400 group-hover/item:text-orange-100 transition-colors">
                                <span>{clase.hora_inicio}</span>
                                <span className="opacity-50 group-hover/item:opacity-100">{clase.hora_fin}</span>
                              </div>
                            </div>
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

        {/* Legend Compacta */}
        <div className="mt-4 flex flex-col sm:flex-row gap-4 items-center justify-between border-t border-white/5 pt-4 px-2">
          <div className="flex items-center gap-2 bg-white/5 px-3 py-1 rounded-lg">
            <div className="w-2 h-2 rounded-full bg-orange-500" />
            <span className="text-[9px] font-black text-slate-400 uppercase italic">Confirmados</span>
          </div>
          <p className="text-[8px] font-medium text-slate-600 uppercase italic text-center sm:text-right">
            Desliza para ver la semana completa →
          </p>
        </div>
      </div>
    </section>
  );
};

export default WeeklyTimelineEnrollment;