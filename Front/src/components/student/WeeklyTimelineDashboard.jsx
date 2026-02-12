import React, { useMemo } from 'react';
import { Clock, CalendarCheck } from 'lucide-react';

const WeeklyTimelineDashboard = ({ agendaSeleccionada = [] }) => {
  const diasConFechas = useMemo(() => {
    const hoy = new Date();
    const lunes = new Date(hoy);
    const diff = hoy.getDay() === 0 ? 6 : hoy.getDay() - 1;
    lunes.setDate(hoy.getDate() - diff);

    return [
      { id: 1, label: 'LUN', nombre: 'Lunes', fecha: new Date(lunes) },
      { id: 2, label: 'MAR', nombre: 'Martes', fecha: new Date(lunes.setDate(lunes.getDate() + 1)) },
      { id: 3, label: 'MIE', nombre: 'Miércoles', fecha: new Date(lunes.setDate(lunes.getDate() + 1)) },
      { id: 4, label: 'JUE', nombre: 'Jueves', fecha: new Date(lunes.setDate(lunes.getDate() + 1)) },
      { id: 5, label: 'VIE', nombre: 'Viernes', fecha: new Date(lunes.setDate(lunes.getDate() + 1)) },
      { id: 6, label: 'SAB', nombre: 'Sábado', fecha: new Date(lunes.setDate(lunes.getDate() + 1)) }
    ];
  }, []);

  const getPosition = (timeStr) => {
    if (!timeStr) return 0;
    const date = new Date(timeStr);
    const hrs = date.getUTCHours(); 
    const mins = date.getUTCMinutes();
    const totalMins = (hrs * 60) + mins;
    return ((totalMins - (8 * 60)) / (14 * 60)) * 100; // 8am a 10pm
  };

  return (
    <section className="bg-[#0f172a] rounded-[3rem] p-8 shadow-2xl border border-white/5 relative overflow-hidden">
      <div className="flex items-center justify-between mb-8 relative z-10">
        <div>
          <h2 className="flex items-center gap-3 text-lg font-black italic uppercase tracking-[0.2em] text-orange-500">
            <CalendarCheck size={24} /> MI AGENDA SEMANAL
          </h2>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1 italic">
             Semana actual // Sesiones confirmadas
          </p>
        </div>
      </div>

      <div className="grid grid-cols-6 gap-4 h-72 relative z-10">
        {diasConFechas.map((dia) => {
          // Filtra por nombre de día (Lunes, Martes...) que viene del Dashboard
          const sesiones = agendaSeleccionada.filter(s => s.dia_semana === dia.nombre);
          const esHoy = new Date().toDateString() === dia.fecha.toDateString();

          return (
            <div key={dia.id} className="relative flex flex-col items-center h-full">
              <div className="flex flex-col items-center mb-4">
                <span className={`text-[10px] font-black uppercase italic ${esHoy ? 'text-orange-500' : 'text-slate-500'}`}>
                  {dia.label}
                </span>
                <span className={`text-[11px] font-bold ${esHoy ? 'text-white' : 'text-slate-600'}`}>
                  {dia.fecha.getDate()}/{dia.fecha.getMonth() + 1}
                </span>
              </div>
              
              <div className={`w-full flex-1 rounded-2xl relative border overflow-hidden backdrop-blur-sm
                ${esHoy ? 'bg-orange-500/[0.05] border-orange-500/30' : 'bg-white/[0.03] border-white/5'}`}>
                {sesiones.map((s) => (
                  <div
                    key={s.id}
                    className="absolute left-1 right-1 rounded-xl bg-gradient-to-br from-blue-600 to-blue-800 p-2 shadow-lg border border-white/10 flex flex-col justify-center"
                    style={{ top: `${getPosition(s.hora_inicio)}%`, height: '25%' }}
                  >
                    <span className="text-[8px] font-black text-white uppercase italic truncate">
                      {s.nivel?.nombre || 'TÉCNICO'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default WeeklyTimelineDashboard;