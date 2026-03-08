import React, { useMemo } from 'react';
import { Clock, CalendarCheck } from 'lucide-react';

const WeeklyTimelineDashboard = ({ agendaSeleccionada = [] }) => {
  const diasConFechas = useMemo(() => {
    const hoy = new Date();
    const lunes = new Date(hoy);
    // Aseguramos que el Lunes sea el inicio de la semana
    const diff = hoy.getDay() === 0 ? 6 : hoy.getDay() - 1;
    lunes.setDate(hoy.getDate() - diff);

    // Función para no mutar el objeto lunes original en cada paso
    const getDia = (diasAumentar) => {
      const nuevaFecha = new Date(lunes);
      nuevaFecha.setDate(lunes.getDate() + diasAumentar);
      return nuevaFecha;
    };

    return [
      { id: 1, label: 'LUN', dbDay: 1, fecha: getDia(0) },
      { id: 2, label: 'MAR', dbDay: 2, fecha: getDia(1) },
      { id: 3, label: 'MIE', dbDay: 3, fecha: getDia(2) },
      { id: 4, label: 'JUE', dbDay: 4, fecha: getDia(3) },
      { id: 5, label: 'VIE', dbDay: 5, fecha: getDia(4) },
      { id: 6, label: 'SAB', dbDay: 6, fecha: getDia(5) },
      { id: 7, label: 'DOM', dbDay: 7, fecha: getDia(6) } // 🔥 DOMINGO AÑADIDO
    ];
  }, []);

  const getPosition = (timeStr) => {
    if (!timeStr) return 0;
    // Extraemos horas y minutos de forma segura ("14:30" o "14:30:00")
    const [horas, minutos] = timeStr.split(':').map(Number);
    const totalMins = (horas * 60) + (minutos || 0);
    return ((totalMins - (8 * 60)) / (14 * 60)) * 100; // Bloque visual: 8am a 10pm
  };

  return (
    <section className="bg-white rounded-[2rem] md:rounded-[3rem] p-4 md:p-8 shadow-2xl border border-orange-100 relative overflow-hidden">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 md:mb-8 relative z-10 gap-2">
        <div>
          <h2 className="flex items-center gap-2 md:gap-3 text-base md:text-lg font-black italic uppercase tracking-[0.15em] md:tracking-[0.2em] text-orange-500">
            <CalendarCheck className="w-5 h-5 md:w-6 md:h-6" /> MI AGENDA SEMANAL
          </h2>
          <p className="text-[9px] md:text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1 italic">
            Semana actual // Sesiones confirmadas
          </p>
        </div>
        <div className="md:hidden text-[8px] font-bold text-slate-400 uppercase tracking-tighter">
          ← Desliza para ver la semana →
        </div>
      </div>

      <div className="relative z-10">
        {/* 🔥 CAMBIADO: grid-cols-6 a grid-cols-7 para que entren los 7 días en PC */}
        <div className="flex md:grid md:grid-cols-7 gap-3 md:gap-4 h-80 md:h-72 overflow-x-auto md:overflow-visible pb-4 md:pb-0 scrollbar-hide snap-x">
          {diasConFechas.map((dia) => {
            // 🔥 CORRECCIÓN CRÍTICA: Comparamos el número de la DB (dia_semana) con el número (dbDay)
            const sesiones = agendaSeleccionada.filter(s => Number(s.dia_semana) === dia.dbDay);
            const esHoy = new Date().toDateString() === dia.fecha.toDateString();

            return (
              <div key={dia.id} className="relative flex flex-col items-center h-full min-w-[120px] md:min-w-0 flex-1 snap-center">
                <div className="flex flex-col items-center mb-3 md:mb-4">
                  <span className={`text-[9px] md:text-[10px] font-black uppercase italic ${esHoy ? 'text-orange-500' : 'text-slate-400'}`}>
                    {dia.label}
                  </span>
                  <div className={`mt-1 px-2 py-0.5 rounded-full ${esHoy ? 'bg-orange-500' : 'bg-transparent'}`}>
                    <span className={`text-[10px] md:text-[11px] font-bold ${esHoy ? 'text-white' : 'text-slate-600'}`}>
                      {dia.fecha.getDate()}/{dia.fecha.getMonth() + 1}
                    </span>
                  </div>
                </div>

                <div className={`w-full flex-1 rounded-2xl relative border overflow-hidden backdrop-blur-sm transition-colors ${esHoy ? 'bg-orange-500/[0.08] border-orange-500/40 shadow-inner' : 'bg-slate-50 border-slate-100'}`}>
                  {sesiones.length === 0 ? (
                    <div className="flex items-center justify-center h-full opacity-20">
                      <span className="text-[10px] font-bold text-slate-400 uppercase italic rotate-90 md:rotate-0">Libre</span>
                    </div>
                  ) : (
                    sesiones.map((s) => (
                      <div
                        key={s.id}
                        className="absolute left-1 right-1 rounded-xl bg-gradient-to-br from-blue-600 to-blue-800 p-1.5 md:p-2 shadow-md border border-white/10 flex flex-col justify-center"
                        style={{ top: `${getPosition(s.hora_inicio)}%`, height: '22%' }}
                      >
                        <span className="text-[7px] md:text-[8px] font-black text-white uppercase italic leading-none truncate">
                          {s.nivel?.nombre || 'TÉCNICO'}
                        </span>
                        <span className="text-[6px] md:text-[7px] text-blue-100 font-bold mt-0.5">
                          {s.hora_inicio}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default WeeklyTimelineDashboard;