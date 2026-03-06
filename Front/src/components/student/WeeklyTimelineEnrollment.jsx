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

  const startDay = 7;  // Ajustado a las 07:00 según tu horario de básico
  const endDay = 24;   // 00:00
  const totalHours = endDay - startDay;

  const getPosition = (timeStr) => {
    if (!timeStr) return 0;
    const [hrs, mins] = timeStr.split(':').map(Number);
    const normalizedHrs = hrs === 0 ? 24 : hrs;
    const totalMins = (normalizedHrs * 60) + mins;
    return ((totalMins - (startDay * 60)) / (totalHours * 60)) * 100;
  };

  return (
    <section className="mb-12 bg-[#020617] rounded-[2.5rem] p-1 shadow-2xl border border-white/5 relative overflow-hidden font-sans">
      {/* Luces de fondo sutiles */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-orange-600/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="p-4 md:p-10 relative z-10">
        {/* Header Header Premium */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
          <div className="space-y-1">
            <h2 className="text-3xl md:text-5xl font-black italic text-white uppercase tracking-tighter leading-none">
              GEMA <span className="text-orange-500">PLANNER</span>
            </h2>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.3em] italic">Elite Training Schedule</p>
          </div>
          <div className="flex items-center gap-4 bg-white/5 px-4 py-2 rounded-2xl border border-white/10 backdrop-blur-md">
            <Clock className="text-orange-500" size={18} />
            <span className="text-xs font-black text-white italic uppercase tracking-widest">07:00 — 00:00</span>
          </div>
        </div>

        {/* Timeline Container */}
        <div className="relative flex overflow-x-auto pb-6 custom-scrollbar border border-white/5 rounded-3xl bg-black/20">

          {/* Gutter de Horas Lateral (Pegajoso) */}
          <div className="flex-none w-14 pt-16 border-r border-white/5 sticky left-0 bg-[#020617]/95 backdrop-blur-md z-30">
            {Array.from({ length: totalHours + 1 }).map((_, i) => (
              <div
                key={i}
                className="text-[9px] font-black text-slate-500 pr-3 flex justify-end italic"
                style={{ height: `${100 / totalHours}%`, transform: 'translateY(-50%)' }}
              >
                {startDay + i}:00
              </div>
            ))}
          </div>

          {/* Grid de Días */}
          <div className="flex-grow grid grid-cols-6 min-w-[900px]">
            {diasSemana.map((dia) => {
              const clasesDelDia = agendaSeleccionada.filter(h => Number(h.dia_semana) === dia.id);

              return (
                <div key={dia.id} className="relative border-r border-white/5 last:border-r-0 min-h-[700px] group/day">
                  {/* Header del Día */}
                  <div className="h-16 flex flex-col items-center justify-center border-b border-white/5 bg-white/[0.02]">
                    <span className="text-[12px] font-black text-white italic uppercase tracking-wider">{dia.label}</span>
                    <div className="w-8 h-1 bg-orange-500 mt-1 opacity-0 group-hover/day:opacity-100 transition-opacity rounded-full" />
                  </div>

                  {/* Área de Contenido */}
                  <div className="relative h-full px-1.5 py-0">
                    {/* Líneas Horizontales de Referencia */}
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
                          className="absolute left-1.5 right-1.5 rounded-xl overflow-hidden group/item transition-all duration-300 hover:z-40 hover:scale-[1.03] shadow-xl hover:shadow-orange-500/20"
                          style={{
                            top: `${top}%`,
                            height: `${height}%`,
                            marginTop: '2px', // Evita el solapamiento visual directo
                            marginBottom: '2px'
                          }}
                        >
                          {/* Fondo con Glassmorphism */}
                          <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900 border border-white/10 group-hover/item:from-orange-600 group-hover/item:to-orange-700 transition-colors duration-500" />

                          {/* Contenido de la Clase */}
                          <div className="relative p-2 h-full flex flex-col justify-between">
                            <div className="flex flex-col gap-0.5">
                              <div className="flex items-center justify-between">
                                <span className="text-[10px] font-black text-white italic uppercase leading-none truncate pr-1">
                                  {clase.nivel?.nombre || 'GEMA CLASS'}
                                </span>
                                <ChevronRight size={10} className="text-orange-500 group-hover/item:text-white" />
                              </div>

                              {/* HORARIO DE INICIO */}
                              <div className="flex items-center gap-1 opacity-80">
                                <span className="text-[7px] font-black text-orange-500 group-hover/item:text-orange-200 uppercase">Inicia:</span>
                                <span className="text-[8px] font-bold text-white tracking-tighter">{clase.hora_inicio}</span>
                              </div>
                            </div>

                            {/* HORARIO DE FIN (Solo se muestra si hay espacio suficiente) */}
                            {height > 8 && (
                              <div className="flex items-center justify-between pt-1 border-t border-white/5">
                                <div className="flex items-center gap-1 opacity-80">
                                  <span className="text-[7px] font-black text-slate-400 group-hover/item:text-white uppercase">Fin:</span>
                                  <span className="text-[8px] font-bold text-white tracking-tighter">{clase.hora_fin}</span>
                                </div>
                                <div className="p-1 bg-white/5 rounded-lg">
                                  <MapPin size={8} className="text-orange-500 group-hover/item:text-white" />
                                </div>
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

        {/* Legend / Simbología */}
        <div className="mt-8 flex flex-wrap gap-8 items-center border-t border-white/5 pt-8">
          <div className="flex items-center gap-3 bg-white/5 px-4 py-2 rounded-xl border border-white/5">
            <div className="w-2 h-2 rounded-full bg-orange-500" />
            <span className="text-[10px] font-black text-slate-400 uppercase italic tracking-widest">Horarios Disponibles</span>
          </div>
          <p className="text-[10px] font-bold text-slate-600 uppercase italic ml-auto">
            * Los bloques están diseñados para evitar cruces directos entre niveles.
          </p>
        </div>
      </div>
    </section>
  );
};

export default WeeklyTimelineEnrollment;