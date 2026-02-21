import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Users, Clock, MapPin, CheckCircle, Calendar, Loader2, ChevronRight, Filter } from 'lucide-react';
import AttendanceModal from '../components/teacher/AttendanceModal';
import { useAuth } from '../context/AuthContext';
import { asistenciaService } from '../services/asistencia.service';
import toast from 'react-hot-toast';

const DashboardTeacher = () => {
  const [selectedClass, setSelectedClass] = useState(null);
  const [clases, setClases] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filtros: Iniciamos en TODOS para ver toda la temporada
  const [filtroMes, setFiltroMes] = useState("TODOS");
  const [filtroAnio, setFiltroAnio] = useState(new Date().getFullYear().toString());

  const { user } = useAuth();
  const hoyRef = useRef(null);

  const coachFirstName = user?.user?.nombres || 'Instructor';
  const coachFullName = user?.user ? `${user.user.nombres} ${user.user.apellidos}` : 'Profesor Gema';

  const fetchAgenda = useCallback(async () => {
    try {
      setLoading(true);
      const data = await asistenciaService.getAgenda();
      const todasLasSesiones = [];
      const hoy = new Date().setHours(0, 0, 0, 0);

      data.forEach(horario => {
        const fechasUnicas = {};
        const timeRange = `${horario.hora_inicio} - ${horario.hora_fin}`; //

        horario.inscripciones.forEach(ins => {
          ins.registros_asistencia.forEach(reg => {
            const fechaObj = new Date(reg.fecha);
            const fechaKey = reg.fecha.split('T')[0];
            const fechaDate = fechaObj.setHours(0, 0, 0, 0);

            if (!fechasUnicas[fechaKey]) {
              fechasUnicas[fechaKey] = {
                id: `${horario.id}-${fechaKey}`,
                title: horario.niveles_entrenamiento?.nombre || 'BASICO-C',
                timeRange,
                court: horario.canchas?.nombre || 'T1',
                level: horario.niveles_entrenamiento?.nombre || 'BASICO-C',
                fechaReal: reg.fecha,
                anio: new Date(reg.fecha).getFullYear().toString(),
                mes: new Date(reg.fecha).getMonth().toString(),
                isToday: fechaDate === hoy,
                isPast: fechaDate < hoy,
                dateFormatted: new Date(reg.fecha).toLocaleDateString('es-ES', { day: '2-digit', month: 'short' }).toUpperCase().replace('.', ''),
                totalStudents: horario.inscripciones.length,
                inscripcionesEnEstaFecha: []
              };
            }
            fechasUnicas[fechaKey].inscripcionesEnEstaFecha.push({ ...ins, registro_especifico: reg });
          });
        });

        Object.values(fechasUnicas).forEach(sesion => {
          const completada = sesion.inscripcionesEnEstaFecha.every(al => al.registro_especifico.estado !== 'PROGRAMADA');
          todasLasSesiones.push({ ...sesion, attended: completada, totalStudents: sesion.inscripcionesEnEstaFecha.length });
        });
      });

      todasLasSesiones.sort((a, b) => new Date(a.fechaReal) - new Date(b.fechaReal));
      setClases(todasLasSesiones);

      // Auto-scroll a la sesión de hoy si existe y estamos en vista "TODOS"
      if (filtroMes === "TODOS") {
        setTimeout(() => hoyRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 800);
      }

    } catch (error) {
      toast.error("Error al cargar la agenda deportiva");
    } finally {
      setLoading(false);
    }
  }, [filtroMes]);

  useEffect(() => { fetchAgenda(); }, [fetchAgenda]);

  const meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
  const anios = ["2025", "2026", "2027"];

  if (loading) return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
      <Loader2 className="animate-spin text-[#1e3a8a]" size={48} />
      <p className="font-black text-[#1e3a8a] uppercase italic text-xs tracking-widest text-center">Sincronizando Sistema Gema...</p>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in-up pb-10 px-4">

      {/* HEADER ORIGINAL RESTAURADO */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-4xl font-black text-[#1e3a8a] uppercase tracking-tighter italic leading-none">
            HOLA, <span className="text-orange-500">PROFE {coachFirstName.toUpperCase()}</span> 👋
          </h1>
          <div className="h-2 w-24 bg-orange-500 rounded-full mt-4 shadow-lg shadow-orange-500/20"></div>
          <p className="text-slate-500 mt-4 font-medium italic">Gestión de rendimiento para {coachFullName}.</p>
        </div>
        <div className="flex items-center gap-2 bg-white px-5 py-3 rounded-2xl border border-slate-200 shadow-sm text-xs font-black text-[#1e3a8a] uppercase tracking-widest italic">
          <Calendar size={18} className="text-orange-500" />
          {new Date().toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' }).toUpperCase()}
        </div>
      </div>

      {/* BARRA DE FILTROS TÉCNICOS */}
      <div className="flex flex-wrap items-center gap-4 bg-slate-100/50 p-4 rounded-[2rem] border border-slate-200">
        <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm">
          <Filter size={16} className="text-orange-500" />
          <select
            value={filtroMes}
            onChange={(e) => setFiltroMes(e.target.value)}
            className="text-[10px] font-black uppercase tracking-widest text-[#1e3a8a] outline-none cursor-pointer bg-transparent"
          >
            <option value="TODOS">TODOS LOS MESES</option>
            {meses.map((mes, idx) => <option key={idx} value={idx.toString()}>{mes.toUpperCase()}</option>)}
          </select>
        </div>

        <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm">
          <Calendar size={16} className="text-orange-500" />
          <select
            value={filtroAnio}
            onChange={(e) => setFiltroAnio(e.target.value)}
            className="text-[10px] font-black uppercase tracking-widest text-[#1e3a8a] outline-none cursor-pointer bg-transparent"
          >
            {anios.map(anio => <option key={anio} value={anio}>{anio}</option>)}
          </select>
        </div>
      </div>

      {/* AGENDA DEPORTIVA */}
      <div className="space-y-6">
        <h2 className="text-xl font-black text-[#1e3a8a] uppercase tracking-tight flex items-center gap-3 italic">
          <div className="w-2 h-8 bg-[#1e3a8a] rounded-full"></div>
          Agenda de Entrenamiento
        </h2>

        <div className="grid gap-6">
          {clases
            .filter(c => (filtroMes === "TODOS" || c.mes === filtroMes) && c.anio === filtroAnio)
            .map((item) => (
              <div
                key={item.id}
                ref={item.isToday ? hoyRef : null}
                className={`group relative bg-white rounded-[2.5rem] p-7 border transition-all flex flex-col md:flex-row md:items-center justify-between gap-6 overflow-hidden border-l-8 
                  ${item.isToday ? 'border-orange-500 shadow-2xl scale-[1.01]' : 'border-[#1e3a8a] shadow-xl hover:shadow-2xl'}
                  ${item.isPast && !item.isToday ? 'opacity-70 bg-slate-50' : ''}`}
              >
                <div className="flex gap-6 relative z-10">
                  <div className={`hidden md:flex flex-col items-center justify-center w-24 h-24 rounded-[1.5rem] font-black shadow-inner transition-colors 
                    ${item.isToday ? 'bg-orange-500 text-white' : item.attended ? 'bg-slate-100 text-slate-300' : 'bg-[#1e3a8a] text-white'}`}>
                    <span className="text-2xl tracking-tighter">{item.dateFormatted.split(' ')[0]}</span>
                    <span className="text-[10px] uppercase tracking-widest opacity-60 italic">{item.dateFormatted.split(' ')[1]}</span>
                  </div>

                  <div className="flex flex-col justify-center">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="bg-orange-50 text-orange-600 text-[10px] font-black px-3 py-1.5 rounded-xl uppercase tracking-widest border border-orange-100 italic">
                        {item.level}
                      </span>
                      {item.attended && (
                        <span className="bg-green-50 text-green-700 text-[10px] font-black px-3 py-1.5 rounded-xl flex items-center gap-1.5 uppercase tracking-widest border border-green-100 italic">
                          <CheckCircle size={14} strokeWidth={3} /> SESIÓN FINALIZADA
                        </span>
                      )}
                    </div>
                    <h3 className={`text-2xl font-black uppercase tracking-tight italic mb-3 leading-none transition-colors ${item.isToday ? 'text-orange-600' : 'text-[#1e3a8a]'}`}>
                      {item.title}
                    </h3>
                    <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-bold text-slate-400 uppercase italic">
                      <span className="flex items-center gap-2"><Clock size={16} className="text-blue-400" /> {item.timeRange} HRS</span>
                      <span className="flex items-center gap-2"><MapPin size={16} className="text-blue-400" /> {item.court}</span>
                      <span className="flex items-center gap-2"><Users size={16} className="text-blue-400" /> {item.totalStudents} ATLETAS</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedClass(item)}
                  className={`w-full md:w-auto px-10 py-5 rounded-[1.5rem] font-black text-xs transition-all flex items-center justify-center gap-3 uppercase tracking-widest shadow-xl active:scale-95 italic
                    ${item.isToday ? 'bg-orange-500 text-white hover:bg-orange-600' : 'bg-[#1e3a8a] text-white hover:bg-[#152a63]'}`}
                >
                  {item.isPast ? 'REVISAR LOG' : 'TOMAR ASISTENCIA'}
                  <ChevronRight size={18} />
                </button>

                {item.isToday && (
                  <div className="absolute top-0 right-0 bg-orange-500 text-white text-[8px] font-black px-4 py-1.5 rounded-bl-2xl italic tracking-tighter">
                    LIVE SESSION
                  </div>
                )}
              </div>
            ))}

          {clases.filter(c => (filtroMes === "TODOS" || c.mes === filtroMes) && c.anio === filtroAnio).length === 0 && (
            <div className="bg-white p-20 rounded-[3rem] border-2 border-dashed border-slate-200 text-center">
              <p className="font-black text-slate-300 uppercase italic tracking-widest text-xs">No hay sesiones para este período</p>
            </div>
          )}
        </div>
      </div>

      {selectedClass && (
        <AttendanceModal
          clase={selectedClass}
          onClose={() => setSelectedClass(null)}
          onRefresh={fetchAgenda}
        />
      )}
    </div>
  );
};

export default DashboardTeacher;