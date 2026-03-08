import React, { useState, useEffect, useMemo } from 'react';
import { CalendarCheck, Loader2, Clock } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { apiFetch } from '../../interceptors/api';
import { API_ROUTES } from '../../constants/apiRoutes';

const WeeklyTimelineDashboard = () => {
  const { userId } = useAuth();
  const [loading, setLoading] = useState(true);
  const [misHorarios, setMisHorarios] = useState([]);

  // 1. CARGAMOS LOS HORARIOS DIRECTAMENTE DESDE LAS INSCRIPCIONES DEL ALUMNO
  useEffect(() => {
    const fetchHorariosAlumno = async () => {
      if (!userId) return;
      try {
        setLoading(true);
        // Usamos la ruta base de inscripciones + /alumno/id (estándar en tu backend)
        const res = await apiFetch.get(`${API_ROUTES.INSCRIPCIONES.BASE}/alumno/${userId}`);
        const result = await res.json();

        if (res.ok && result.data) {
          // Filtramos solo las inscripciones válidas
          const inscripcionesValidas = result.data.filter((insc) =>
            ['ACTIVO', 'PEN-RECU', 'POR_VALIDAR'].includes(insc.estado)
          );

          // Extraemos y limpiamos los horarios
          const agendaLimpia = inscripcionesValidas.map((insc) => insc.horarios_clases);
          setMisHorarios(agendaLimpia);
        }
      } catch (error) {
        console.error("Error al cargar agenda del estudiante:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHorariosAlumno();
  }, [userId]);

  // 2. CONFIGURAMOS LOS DÍAS DE LA SEMANA (INCLUYENDO DOMINGO = 7)
  const diasConFechas = useMemo(() => {
    const hoy = new Date();
    const lunes = new Date(hoy);
    const diff = hoy.getDay() === 0 ? 6 : hoy.getDay() - 1; // Si es domingo (0), restamos 6 para ir al lunes
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
      { id: 7, label: 'DOM', dbDay: 7, fecha: getDia(6) } // 🔥 DOMINGO CORRECTAMENTE MAPEADO A 7
    ];
  }, []);

  // 3. FUNCIÓN PARA LIMPIAR EL BUG DEL 1970
  const formatTime = (timeStr) => {
    if (!timeStr) return '--:--';
    if (timeStr.includes('T')) {
      const d = new Date(timeStr);
      return `${d.getUTCHours().toString().padStart(2, '0')}:${d.getUTCMinutes().toString().padStart(2, '0')}`;
    }
    return timeStr.slice(0, 5); // Por si ya viene como "19:00:00"
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
      {/* Encabezado */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 relative z-10 gap-2">
        <div>
          <h2 className="flex items-center gap-2 md:gap-3 text-base md:text-lg font-black italic uppercase tracking-[0.15em] md:tracking-[0.2em] text-orange-500">
            <CalendarCheck className="w-5 h-5 md:w-6 md:h-6" /> MI AGENDA SEMANAL
          </h2>
          <p className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1 italic">
            Clases inscritas oficialmente
          </p>
        </div>
        <div className="md:hidden text-[9px] font-black text-[#1e3a8a] uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full animate-pulse">
          ← Desliza →
        </div>
      </div>

      {/* Grid Calendario Responsivo */}
      <div className="relative z-10">
        <div className="flex md:grid md:grid-cols-7 gap-3 h-[280px] md:h-auto overflow-x-auto md:overflow-visible pb-4 md:pb-0 scrollbar-hide snap-x">
          
          {diasConFechas.map((dia) => {
            // Filtramos comparando número con número
            const clasesDelDia = misHorarios.filter(h => Number(h?.dia_semana) === dia.dbDay);
            const esHoy = new Date().toDateString() === dia.fecha.toDateString();

            return (
              <div key={dia.id} className="relative flex flex-col h-full min-w-[130px] md:min-w-0 flex-1 snap-center">
                
                {/* Cabecera del Día */}
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

                {/* Contenedor de Clases (Tarjetas Apiladas) */}
                <div className={`w-full flex-1 rounded-3xl p-2 md:p-3 flex flex-col gap-2 border transition-all ${esHoy ? 'bg-orange-50/50 border-orange-200' : 'bg-slate-50/50 border-slate-100'}`}>
                  
                  {clasesDelDia.length === 0 ? (
                    <div className="flex-1 flex items-center justify-center opacity-30">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Libre</span>
                    </div>
                  ) : (
                    clasesDelDia.map((clase, index) => (
                      <div key={index} className="bg-gradient-to-br from-[#1e3a8a] to-blue-800 rounded-2xl p-3 shadow-lg border border-white/10 relative overflow-hidden group hover:scale-[1.02] transition-transform">
                        {/* Brillo decorativo */}
                        <div className="absolute top-0 right-0 w-16 h-16 bg-white opacity-5 rounded-bl-full"></div>
                        
                        <div className="flex flex-col relative z-10">
                          <span className="text-[9px] md:text-[10px] font-black text-orange-400 uppercase tracking-widest mb-1 italic">
                            {clase?.niveles_entrenamiento?.nombre || 'TÉCNICO'}
                          </span>
                          
                          <div className="flex items-center gap-1.5 text-white">
                            <Clock size={12} className="opacity-70" />
                            <span className="text-xs md:text-sm font-bold tracking-wider">
                              {formatTime(clase?.hora_inicio)}
                            </span>
                          </div>
                        </div>
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