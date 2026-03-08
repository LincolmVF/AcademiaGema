import React, { useState, useEffect, useMemo } from 'react';
import { CalendarCheck, Loader2, Clock } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { apiFetch } from '../../interceptors/api';
import { API_ROUTES } from '../../constants/apiRoutes';

const WeeklyTimelineDashboard = () => {
  const { userId } = useAuth();
  const [loading, setLoading] = useState(true);
  const [clasesProgramadas, setClasesProgramadas] = useState([]);

  // 1. AHORA TRAEMOS LAS ASISTENCIAS (FECHAS EXACTAS), NO SOLO EL MOLDE DEL HORARIO
  useEffect(() => {
    const fetchAsistenciasAlumno = async () => {
      if (!userId) return;
      try {
        setLoading(true);
        // Usamos la ruta que trae los registros_asistencia específicos del alumno
        const res = await apiFetch.get(API_ROUTES.ASISTENCIAS.ALUMNO_HISTORIAL(userId));
        const result = await res.json();

        if (res.ok && result.data) {
          // Guardamos las asistencias programadas
          setClasesProgramadas(result.data);
        }
      } catch (error) {
        console.error("Error al cargar agenda exacta del estudiante:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAsistenciasAlumno();
  }, [userId]);

  // 2. CONFIGURACIÓN DEL CALENDARIO DE ESTA SEMANA
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
      { id: 1, label: 'LUN', fecha: getDia(0) },
      { id: 2, label: 'MAR', fecha: getDia(1) },
      { id: 3, label: 'MIE', fecha: getDia(2) },
      { id: 4, label: 'JUE', fecha: getDia(3) },
      { id: 5, label: 'VIE', fecha: getDia(4) },
      { id: 6, label: 'SAB', fecha: getDia(5) },
      { id: 7, label: 'DOM', fecha: getDia(6) }
    ];
  }, []);

  // 3. FUNCIONES UTILITARIAS SEGURAS
  const formatTime = (timeStr) => {
    if (!timeStr) return '--:--';
    if (timeStr.includes('T')) {
      const d = new Date(timeStr);
      return `${d.getUTCHours().toString().padStart(2, '0')}:${d.getUTCMinutes().toString().padStart(2, '0')}`;
    }
    return timeStr.slice(0, 5);
  };

  // 🔥 ESTA FUNCIÓN ES CLAVE: Compara YYYY-MM-DD ignorando la hora, para que el front no se maree con el UTC
  const esMismaFecha = (fechaDbIso, fechaLocalCalendario) => {
    if (!fechaDbIso) return false;
    const fechaDbStr = fechaDbIso.split('T')[0]; // Ej: "2026-03-09"
    
    const year = fechaLocalCalendario.getFullYear();
    const month = String(fechaLocalCalendario.getMonth() + 1).padStart(2, '0');
    const day = String(fechaLocalCalendario.getDate()).padStart(2, '0');
    const fechaCalStr = `${year}-${month}-${day}`; // Ej: "2026-03-09"

    return fechaDbStr === fechaCalStr;
  };

  if (loading) {
    return (
      <div className="bg-white rounded-[2rem] p-8 shadow-2xl flex justify-center items-center h-48 border border-slate-100">
        <Loader2 className="animate-spin text-orange-500" size={32} />
      </div>
    );
  }

  return (
    <section className="bg-white rounded-[2rem] md:rounded-[3rem] p-5 md:p-8 shadow-xl border border-slate-100 relative overflow-hidden">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 relative z-10 gap-2">
        <div>
          <h2 className="flex items-center gap-2 md:gap-3 text-base md:text-lg font-black italic uppercase tracking-[0.15em] md:tracking-[0.2em] text-orange-500">
            <CalendarCheck className="w-5 h-5 md:w-6 md:h-6" /> MI AGENDA SEMANAL
          </h2>
          <p className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1 italic">
            Clases exactas programadas
          </p>
        </div>
        <div className="md:hidden text-[9px] font-black text-[#1e3a8a] uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full animate-pulse">
          ← Desliza →
        </div>
      </div>

      <div className="relative z-10">
        <div className="flex md:grid md:grid-cols-7 gap-3 h-[280px] md:h-auto overflow-x-auto md:overflow-visible pb-4 md:pb-0 scrollbar-hide snap-x">
          
          {diasConFechas.map((dia) => {
            // 🔥 AHORA FILTRAMOS POR LA FECHA EXACTA, NO SOLO POR EL DÍA DE LA SEMANA
            const clasesDelDia = clasesProgramadas.filter(registro => 
              esMismaFecha(registro.fecha, dia.fecha)
            );
            const esHoy = new Date().toDateString() === dia.fecha.toDateString();

            return (
              <div key={dia.id} className="relative flex flex-col h-full min-w-[130px] md:min-w-0 flex-1 snap-center">
                
                <div className="flex flex-col items-center mb-3">
                  <span className={`text-[10px] md:text-xs font-black uppercase italic tracking-wider ${esHoy ? 'text-orange-500' : 'text-[#1e3a8a]'}`}>
                    {dia.label}
                  </span>
                  <div className={`mt-1.5 px-3 py-1 rounded-full ${esHoy ? 'bg-orange-500 shadow-md shadow-orange-500/30' : 'bg-slate-100'}`}>
                    <span className={`text-[10px] md:text-[11px] font-bold tracking-widest ${esHoy ? 'text-white' : 'text-slate-500'}`}>
                      {dia.fecha.getDate()}/{dia.fecha.getMonth() + 1}
                    </span>
                  </div>
                </div>

                <div className={`w-full flex-1 rounded-3xl p-2 md:p-3 flex flex-col gap-2 border transition-all ${esHoy ? 'bg-orange-50/50 border-orange-200' : 'bg-slate-50/50 border-slate-100'}`}>
                  
                  {clasesDelDia.length === 0 ? (
                    <div className="flex-1 flex items-center justify-center opacity-30">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Libre</span>
                    </div>
                  ) : (
                    clasesDelDia.map((registroAsistencia, index) => {
                      // Extraemos el horario vinculado a este registro de asistencia
                      const horario = registroAsistencia.inscripciones?.horarios_clases;

                      return (
                        <div key={index} className="bg-gradient-to-br from-[#1e3a8a] to-blue-800 rounded-2xl p-3 shadow-lg border border-white/10 relative overflow-hidden group hover:scale-[1.02] transition-transform">
                          <div className="absolute top-0 right-0 w-16 h-16 bg-white opacity-5 rounded-bl-full"></div>
                          
                          <div className="flex flex-col relative z-10">
                            <span className="text-[9px] md:text-[10px] font-black text-orange-400 uppercase tracking-widest mb-1 italic">
                              {horario?.niveles_entrenamiento?.nombre || 'TÉCNICO'}
                            </span>
                            
                            <div className="flex items-center gap-1.5 text-white">
                              <Clock size={12} className="opacity-70" />
                              <span className="text-xs md:text-sm font-bold tracking-wider">
                                {formatTime(horario?.hora_inicio)}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })
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