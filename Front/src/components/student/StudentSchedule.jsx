import React, { useMemo } from 'react';
import { Clock, MapPin, User, Star, Zap, CheckCircle2, CircleDashed, Calendar } from 'lucide-react';

const StudentSchedule = ({ attendance = [], filtroMes, filtroAnio }) => {
  const diasSemana = ["DOM", "LUN", "MAR", "MIE", "JUE", "VIE", "SAB"];
  const meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

  /**
   * ✅ CORRECCIÓN FECHAS: Normaliza la zona horaria para evitar el "día anterior".
   * Ajusta el objeto Date local sumando el offset para que 00:00 UTC sea 00:00 Local.
   */
  const parseLocalDate = (fechaString) => {
    if (!fechaString) return new Date();
    const date = new Date(fechaString);
    date.setMinutes(date.getMinutes() + date.getTimezoneOffset());
    return date;
  };

  /**
   * ✅ CORRECCIÓN 1970: Extrae solo HH:mm.
   * Evita que el navegador asigne el año 1970 a los strings de hora que vienen de la DB.
   */
  const formatTimeDirect = (timeSource) => {
    if (!timeSource) return '--:--';
    if (typeof timeSource === 'string') {
      const match = timeSource.match(/(\d{2}:\d{2})/);
      return match ? match[1] : timeSource.substring(0, 5);
    }
    return new Date(timeSource).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
  };

  // 1. FILTRADO TÉCNICO Y ORDENAMIENTO
  const sesionesFiltradas = useMemo(() => {
    return attendance
      .filter(s => {
        const fechaSesion = parseLocalDate(s.fecha);
        const matchMes = filtroMes === "TODOS" || fechaSesion.getMonth().toString() === filtroMes;
        const matchAnio = fechaSesion.getFullYear().toString() === filtroAnio;
        return s?.inscripciones?.horarios_clases && matchMes && matchAnio;
      })
      .sort((a, b) => new Date(a.fecha) - new Date(b.fecha));
  }, [attendance, filtroMes, filtroAnio]);

  // 2. AGRUPACIÓN POR MES PARA LA VISTA
  const sesionesPorMes = useMemo(() => {
    return sesionesFiltradas.reduce((acc, sesion) => {
      const fecha = parseLocalDate(sesion.fecha);
      const mesAnio = `${meses[fecha.getMonth()]} ${fecha.getFullYear()}`;
      if (!acc[mesAnio]) acc[mesAnio] = [];
      acc[mesAnio].push(sesion);
      return acc;
    }, {});
  }, [sesionesFiltradas]);

  return (
    <div className="flex flex-col h-full bg-white rounded-[2.5rem] shadow-xl border border-slate-100 overflow-hidden animate-fade-in">
      {/* HEADER */}
      <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
        <div className="flex items-center gap-3">
          <div className="w-2 h-8 bg-[#1e3a8a] rounded-full"></div>
          <h2 className="font-black text-[#1e3a8a] uppercase tracking-tight text-lg italic">Mi Plan de Entrenamiento</h2>
        </div>
        <Zap size={20} className="text-orange-500 fill-orange-500/20" />
      </div>

      <div className="p-6 space-y-8 flex-grow overflow-y-auto max-h-[750px] custom-scrollbar bg-slate-50/30">
        {Object.keys(sesionesPorMes).length > 0 ? Object.entries(sesionesPorMes).map(([mes, items]) => (
          <div key={mes} className="space-y-4">
            <div className="flex items-center gap-4 py-2">
              <span className="text-[10px] font-black text-orange-500 uppercase tracking-[0.3em] whitespace-nowrap italic">{mes}</span>
              <div className="h-px w-full bg-slate-200"></div>
            </div>

            {items.map((sesion) => {
              const horario = sesion?.inscripciones?.horarios_clases;

              /**
               * ✅ RUTA DEL NOMBRE CORREGIDA (Basado en tu JSON):
               * Accedemos a: horario -> coordinadores -> usuarios -> nombres / apellidos
               */
              const coordinatorData = horario?.coordinadores?.usuarios;
              const nombreLider = coordinatorData
                ? `${coordinatorData.nombres.trim()} ${coordinatorData.apellidos.trim()}`
                : 'COORDINATOR GEMA';

              const fechaObj = parseLocalDate(sesion.fecha);
              const esPresente = sesion.estado === 'PRESENTE';
              const esFalta = sesion.estado === 'FALTA';

              return (
                <div key={sesion.id} className={`group relative rounded-[2rem] border transition-all duration-300 ${esPresente ? 'bg-green-50/50 border-green-200 shadow-sm' :
                  esFalta ? 'bg-red-50/50 border-red-200 shadow-sm' :
                    'bg-white border-slate-100 hover:border-blue-300 hover:shadow-2xl'
                  }`}>
                  <div className="p-5 flex flex-col md:flex-row items-center gap-6">

                    {/* INDICADOR DE FECHA DEPORTIVO */}
                    <div className="flex items-center gap-4 min-w-[140px]">
                      <div className={`flex flex-col items-center justify-center w-16 h-16 rounded-2xl font-black shadow-md ${esPresente ? 'bg-green-600 text-white' :
                        esFalta ? 'bg-red-600 text-white' :
                          'bg-[#1e3a8a] text-white'
                        }`}>
                        <span className="text-[9px] opacity-70 uppercase italic">{diasSemana[fechaObj.getDay()]}</span>
                        <span className="text-2xl leading-none">{fechaObj.getDate()}</span>
                      </div>
                      <div className="text-left">
                        <div className="flex items-center gap-1 text-orange-500 font-black">
                          <Clock size={12} />
                          <span className="text-[10px] uppercase tracking-tighter">
                            {formatTimeDirect(horario?.hora_inicio)}
                          </span>
                        </div>
                        <h4 className="text-[11px] font-black text-[#1e3a8a] uppercase italic leading-tight">Sesión Técnica</h4>
                      </div>
                    </div>

                    {/* DATOS DE LA SESIÓN */}
                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 flex-1 w-full border-t md:border-t-0 md:border-l border-slate-100 md:pl-6 pt-4 md:pt-0">
                      <div className="space-y-1 text-left">
                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Cancha / Sede</p>
                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-600 uppercase italic">
                          <MapPin size={12} className="text-blue-500" />
                          {horario?.canchas?.nombre || 'T1'}
                        </div>
                      </div>

                      <div className="space-y-1 text-left">
                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Nivel Pro</p>
                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-600 uppercase italic">
                          <Star size={12} className="text-yellow-500 fill-yellow-500" />
                          {horario?.niveles_entrenamiento?.nombre || 'Formativo'}
                        </div>
                      </div>

                      {/* NOMBRE DEL LÍDER TÉCNICO DINÁMICO */}
                      <div className="space-y-1 hidden lg:block text-left">
                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Líder Técnico</p>
                        <div className="flex items-center gap-1.5 text-[10px] font-black text-[#1e3a8a] uppercase italic">
                          <User size={12} className="text-indigo-500" />
                          <span>{nombreLider}</span>
                        </div>
                      </div>
                    </div>

                    {/* STATUS BADGE */}
                    <div className={`shrink-0 flex items-center justify-center min-w-[100px] gap-2 px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase italic shadow-sm border ${esPresente ? 'bg-green-100 text-green-700 border-green-200' :
                      esFalta ? 'bg-red-100 text-red-700 border-red-200' :
                        'bg-blue-50 text-blue-600 border-blue-100'
                      }`}>
                      {esPresente ? <CheckCircle2 size={14} strokeWidth={3} /> : <CircleDashed size={14} className={sesion.estado === 'PROGRAMADA' ? "animate-spin-slow" : ""} />}
                      {sesion.estado === 'PROGRAMADA' ? 'PRÓXIMA' : sesion.estado}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )) : (
          <div className="py-32 text-center space-y-4">
            <Calendar className="mx-auto text-slate-200" size={60} strokeWidth={1} />
            <p className="text-slate-400 font-black uppercase italic tracking-[0.3em] text-xs">No se encontraron sesiones programadas</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentSchedule;