import React, { useMemo } from 'react';
import { CalendarCheck } from 'lucide-react';

const WeeklyTimelineDashboard = ({ agendaSeleccionada = [] }) => {
  // --- CONFIGURACIÓN DEL PLANNER ---
  const HORA_INICIO = 8; // 08:00 AM
  const HORA_FIN = 24; // 24:00 (12:00 AM)
  const PIXELES_POR_MINUTO = 1; // 1 min = 1px

  // Generamos el array de horas [8, 9, 10, ... 23, 24]
  const horasDelDia = Array.from({ length: HORA_FIN - HORA_INICIO + 1 }, (_, i) => HORA_INICIO + i);

  // 1. CONFIGURACIÓN DE LOS DÍAS
  const diasConFechas = useMemo(() => {
    const hoy = new Date();
    const lunes = new Date(hoy);
    const diff = hoy.getDay() === 0 ? 6 : hoy.getDay() - 1; 
    lunes.setDate(hoy.getDate() - diff);

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
      { id: 7, label: 'DOM', dbDay: 7, fecha: getDia(6) }
    ];
  }, []);

  // 2. FUNCIONES UTILITARIAS Y DE POSICIONAMIENTO
  const formatTime = (timeStr) => {
    if (!timeStr) return '--:--';
    if (timeStr.includes('T')) {
      const d = new Date(timeStr);
      return `${d.getUTCHours().toString().padStart(2, '0')}:${d.getUTCMinutes().toString().padStart(2, '0')}`;
    }
    return timeStr.slice(0, 5); 
  };

  const getTopPosition = (horaStr) => {
    if (!horaStr) return 0;
    const time = formatTime(horaStr);
    const [horas, minutos] = time.split(':').map(Number);
    const minutosTotales = (horas * 60) + minutos;
    const minutosInicioPlanner = HORA_INICIO * 60;
    return (minutosTotales - minutosInicioPlanner) * PIXELES_POR_MINUTO;
  };

  const getCardHeight = (horaInicioStr, horaFinStr) => {
    if (!horaInicioStr || !horaFinStr) return 60; 
    const inicio = formatTime(horaInicioStr);
    const fin = formatTime(horaFinStr);
    
    const [hI, mI] = inicio.split(':').map(Number);
    const [hF, mF] = fin.split(':').map(Number);
    
    const durationMinutos = ((hF * 60) + mF) - ((hI * 60) + mI);
    return Math.max(durationMinutos * PIXELES_POR_MINUTO, 30); 
  };

  return (
    <section className="bg-white rounded-[2rem] md:rounded-[3rem] p-4 md:p-8 shadow-xl border border-slate-100 relative overflow-hidden flex flex-col">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 relative z-10 gap-2 shrink-0">
        <div>
          <h2 className="flex items-center gap-2 md:gap-3 text-base md:text-lg font-black italic uppercase tracking-[0.15em] md:tracking-[0.2em] text-orange-500">
            <CalendarCheck className="w-5 h-5 md:w-6 md:h-6" /> GEMA PLANNER
          </h2>
          <p className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1 italic">
            Semana Completa // Sesiones Programadas
          </p>
        </div>
        <div className="md:hidden text-[9px] font-black text-[#1e3a8a] uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full animate-pulse self-start mt-2">
          ← Desliza la tabla →
        </div>
      </div>

      {/* CONTENEDOR PRINCIPAL DEL PLANNER CON SCROLL XY */}
      <div className="relative flex-1 overflow-hidden border border-slate-100 rounded-2xl bg-slate-50 shadow-inner max-h-[500px] flex flex-col">
        
        <div className="overflow-auto custom-scrollbar flex-1 relative flex">
          
          {/* COLUMNA FIJA DE HORAS (IZQUIERDA) */}
          <div className="sticky left-0 z-30 bg-white border-r border-slate-200 w-14 shrink-0 flex flex-col pt-[70px]">
            {horasDelDia.map((hora) => (
              <div key={hora} className="h-[60px] flex justify-center items-start -mt-2.5">
                <span className="text-[9px] md:text-[10px] font-bold text-slate-400 italic">
                  {hora}:00
                </span>
              </div>
            ))}
          </div>

          {/* ÁREA DE DÍAS Y HORARIOS (SCROLLABLE) */}
          <div className="flex-1 min-w-[700px] flex flex-col relative">
            
            {/* Cabecera Fija de Días */}
            <div className="sticky top-0 z-20 flex bg-white/95 backdrop-blur border-b border-slate-200 h-[70px]">
              {diasConFechas.map(dia => {
                const esHoy = new Date().toDateString() === dia.fecha.toDateString();
                return (
                  <div key={dia.id} className="flex-1 border-r border-slate-100 flex flex-col items-center justify-center min-w-[100px] last:border-r-0">
                    <span className={`text-[10px] md:text-xs font-black uppercase italic tracking-widest ${esHoy ? 'text-orange-500' : 'text-[#1e3a8a]'}`}>
                      {dia.label}
                    </span>
                    <span className={`mt-1 text-[9px] md:text-[10px] font-bold ${esHoy ? 'bg-orange-500 text-white px-2 py-0.5 rounded-full' : 'text-slate-400'}`}>
                      {dia.fecha.getDate()}/{dia.fecha.getMonth() + 1}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Cuadrícula de Horas (Fondo) */}
            <div className="relative flex flex-1">
              
              {/* Líneas horizontales de fondo */}
              <div className="absolute inset-0 pointer-events-none flex flex-col">
                {horasDelDia.map((hora) => (
                  <div key={`line-${hora}`} className="h-[60px] w-full border-b border-slate-200/50"></div>
                ))}
              </div>

              {/* Columnas de los Días y Tarjetas Absolutas */}
              {diasConFechas.map((dia) => {
                // 🔥 AQUÍ ESTÁ EL CAMBIO CRÍTICO: Usamos 'agendaSeleccionada' y comparamos con 'dia.dbDay'
                const clasesDelDia = agendaSeleccionada.filter(h => Number(h?.dia_semana) === dia.dbDay);
                const esHoy = new Date().toDateString() === dia.fecha.toDateString();

                return (
                  <div key={`col-${dia.id}`} className={`flex-1 relative min-w-[100px] border-r border-slate-200/50 last:border-r-0 ${esHoy ? 'bg-orange-50/30' : ''}`} style={{ height: `${(HORA_FIN - HORA_INICIO) * 60}px` }}>
                    
                    {clasesDelDia.map((clase, index) => {
                      const topPx = getTopPosition(clase?.hora_inicio);
                      const heightPx = getCardHeight(clase?.hora_inicio, clase?.hora_fin);

                      return (
                        <div 
                          key={index} 
                          className="absolute left-1 right-1 bg-white border border-slate-200 rounded-xl shadow-md overflow-hidden flex transition-transform hover:scale-[1.02] hover:shadow-lg hover:z-10 cursor-pointer"
                          style={{ top: `${topPx}px`, height: `${heightPx}px` }}
                        >
                          <div className="w-1.5 bg-[#1e3a8a] h-full shrink-0"></div>
                          
                          <div className="flex-1 p-2 md:p-2.5 flex flex-col justify-center">
                            <span className="text-[9px] md:text-[10px] font-black text-[#1e3a8a] uppercase italic tracking-tight leading-none truncate">
                              {clase?.nivel?.nombre || clase?.niveles_entrenamiento?.nombre || 'BÁSICO'}
                            </span>
                            
                            <div className="mt-1.5 flex flex-col gap-0.5">
                              <div className="flex items-center gap-1.5">
                                <div className="w-1.5 h-1.5 rounded-full bg-orange-500 shrink-0"></div>
                                <span className="text-[9px] md:text-[10px] font-bold text-slate-600 leading-none">
                                  {formatTime(clase?.hora_inicio)}
                                </span>
                              </div>
                              <div className="flex items-center gap-1.5">
                                <div className="w-1.5 h-1.5 rounded-full bg-slate-300 shrink-0"></div>
                                <span className="text-[9px] md:text-[10px] font-medium text-slate-400 leading-none">
                                  {formatTime(clase?.hora_fin)}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}

                  </div>
                );
              })}
            </div>

          </div>
        </div>
      </div>

    </section>
  );
};

export default WeeklyTimelineDashboard;