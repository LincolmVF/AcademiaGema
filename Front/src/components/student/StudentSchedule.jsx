import React from 'react';
import { Clock, MapPin, User, Star, Zap, CheckCircle2, CircleDashed } from 'lucide-react';

const StudentSchedule = ({ attendance = [] }) => {
  const diasSemana = ["DOM", "LUN", "MAR", "MIE", "JUE", "VIE", "SAB"];
  const meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

  // 1. LIMPIEZA Y ORDENAMIENTO CRONOLÓGICO
  const sesionesOrdenadas = [...attendance]
    .filter(s => s?.inscripciones?.horarios_clases) // Seguridad de datos
    .sort((a, b) => new Date(a.fecha) - new Date(b.fecha)); // Orden ascendente por fecha

  // 2. AGRUPACIÓN POR MES
  const sesionesPorMes = sesionesOrdenadas.reduce((acc, sesion) => {
    const fecha = new Date(sesion.fecha);
    const mesAnio = `${meses[fecha.getMonth()]} ${fecha.getFullYear()}`;
    if (!acc[mesAnio]) acc[mesAnio] = [];
    acc[mesAnio].push(sesion);
    return acc;
  }, {});

  return (
    <div className="flex flex-col h-full bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
      {/* Header */}
      <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
        <div className="flex items-center gap-3">
          <div className="w-2 h-8 bg-[#1e3a8a] rounded-full"></div>
          <h2 className="font-black text-[#1e3a8a] uppercase tracking-tight text-lg italic">Mi Plan de Entrenamiento</h2>
        </div>
        <Zap size={20} className="text-orange-500 fill-orange-500/20" />
      </div>

      <div className="p-6 space-y-8 flex-grow overflow-y-auto max-h-[700px] custom-scrollbar">
        {Object.keys(sesionesPorMes).length > 0 ? Object.entries(sesionesPorMes).map(([mes, items]) => (
          <div key={mes} className="space-y-4">
            {/* ETIQUETA DE MES */}
            <div className="flex items-center gap-4">
              <span className="text-xs font-black text-orange-500 uppercase tracking-[0.3em] whitespace-nowrap">{mes}</span>
              <div className="h-px w-full bg-slate-100"></div>
            </div>

            {items.map((sesion) => {
              const horario = sesion?.inscripciones?.horarios_clases;
              const profesor = horario?.profesores;
              const fechaObj = new Date(sesion.fecha);
              const esPresente = sesion.estado === 'PRESENTE';
              
              const formatTime = (iso) => iso ? new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--:--';

              return (
                <div key={sesion.id} className={`relative rounded-[2rem] border transition-all duration-300 ${
                  esPresente ? 'bg-green-50/30 border-green-100' : 'bg-white border-slate-100 hover:border-blue-200 hover:shadow-lg'
                }`}>
                  <div className="p-5 flex flex-col md:flex-row items-center gap-6">
                    
                    {/* FECHA REDISEÑADA */}
                    <div className="flex items-center gap-4 min-w-[120px]">
                      <div className={`flex flex-col items-center justify-center w-14 h-14 rounded-2xl font-black ${
                        esPresente ? 'bg-green-600 text-white' : 'bg-[#1e3a8a] text-white'
                      }`}>
                        <span className="text-[9px] opacity-80 uppercase">{diasSemana[fechaObj.getDay()]}</span>
                        <span className="text-xl leading-none">{fechaObj.getDate()}</span>
                      </div>
                      <div className="text-left">
                        <div className="flex items-center gap-1 text-orange-500">
                          <Clock size={12} />
                          <span className="text-[10px] font-black uppercase">{formatTime(horario?.hora_inicio)}</span>
                        </div>
                        <h4 className="text-xs font-black text-[#1e3a8a] uppercase italic">Sesión Técnica</h4>
                      </div>
                    </div>

                    {/* INFORMACIÓN DINÁMICA */}
                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 flex-1 w-full border-t md:border-t-0 md:border-l border-slate-50 md:pl-6 pt-4 md:pt-0">
                      <div className="text-left">
                        <p className="text-[8px] font-black text-slate-300 uppercase tracking-widest">Lugar</p>
                        <div className="flex items-center gap-1 text-[10px] font-bold text-slate-600 uppercase">
                          <MapPin size={12} className="text-blue-500" />
                          {horario?.canchas?.nombre}
                        </div>
                      </div>
                      
                      <div className="text-left">
                        <p className="text-[8px] font-black text-slate-300 uppercase tracking-widest">Nivel</p>
                        <div className="flex items-center gap-1 text-[10px] font-bold text-slate-600 uppercase">
                          <Star size={12} className="text-yellow-500" />
                          {horario?.niveles_entrenamiento?.nombre}
                        </div>
                      </div>

                      <div className="text-left hidden lg:block">
                        <p className="text-[8px] font-black text-slate-300 uppercase tracking-widest">Coach</p>
                        <div className="flex items-center gap-1 text-[10px] font-bold text-[#1e3a8a] uppercase">
                          <User size={12} className="text-indigo-400" />
                          {profesor?.usuarios?.nombres}
                        </div>
                      </div>
                    </div>

                    {/* ESTADO */}
                    <div className={`shrink-0 flex items-center gap-2 px-4 py-2 rounded-xl text-[9px] font-black uppercase italic ${
                      esPresente ? 'bg-green-100 text-green-700' : 'bg-blue-50 text-blue-600 border border-blue-100'
                    }`}>
                      {esPresente ? <CheckCircle2 size={12}/> : <CircleDashed size={12} />}
                      {sesion.estado === 'PROGRAMADA' ? 'Próxima' : sesion.estado}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )) : (
          <div className="py-20 text-center text-slate-400 font-bold italic uppercase text-xs">Sin sesiones programadas</div>
        )}
      </div>
    </div>
  );
};

export default StudentSchedule;