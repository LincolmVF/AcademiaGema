import React, { useState, useEffect, useCallback } from 'react';
import { Users, Clock, MapPin, CheckCircle, Calendar, Zap, Loader2 } from 'lucide-react';
import AttendanceModal from '../components/teacher/AttendanceModal';
import { useAuth } from '../context/AuthContext';
import { asistenciaService } from '../services/asistencia.service';
import toast from 'react-hot-toast';

const DashboardTeacher = () => {
  const [selectedClass, setSelectedClass] = useState(null);
  const [clases, setClases] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  // Normalización de datos del usuario logueado
  const coachFirstName = user?.user?.nombres || 'Instructor';
  const coachFullName = user?.user ? `${user.user.nombres} ${user.user.apellidos}` : 'Profesor Gema';

  const fetchAgenda = useCallback(async () => {
    try {
      setLoading(true);
      const data = await asistenciaService.getAgendaHoy();
      
      const clasesMapeadas = (data || []).map(horario => ({
        id: horario.id,
        title: `Entrenamiento - ${horario.niveles_entrenamiento?.nombre || 'Voleibol'}`,
        time: horario.hora_inicio?.split(':').slice(0, 2).join(':') || '--:--',
        court: horario.canchas?.nombre || 'Cancha principal',
        level: horario.niveles_entrenamiento?.nombre || 'Nivel Gema',
        totalStudents: horario.inscripciones?.length || 0,
        attended: horario.inscripciones?.length > 0 && horario.inscripciones.every(ins => 
          ins.registros_asistencia[0]?.estado !== 'PROGRAMADA'
        ),
        inscripciones: horario.inscripciones || []
      }));

      setClases(clasesMapeadas);
    } catch (error) {
      console.error("Error al cargar agenda:", error);
      if (error.status === 403) {
        toast.error("Error 403: Tu sesión no tiene permisos de Profesor. Intenta re-loguear.");
      }
      setClases([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAgenda();
  }, [fetchAgenda]);

  const handleOpenAttendance = (clase) => {
    setSelectedClass(clase);
  };

  const handleSaveAttendance = () => {
    setSelectedClass(null);
    fetchAgenda(); // Recarga la lista para mostrar el check de "Completado"
  };

  if (loading) return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
      <Loader2 className="animate-spin text-[#1e3a8a]" size={48} />
      <p className="font-black text-[#1e3a8a] uppercase italic text-xs tracking-widest">Sincronizando Agenda...</p>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in-up pb-10">
      {/* 1. Header Dinámico */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-4xl font-black text-[#1e3a8a] uppercase tracking-tighter italic leading-none">
            HOLA, <span className="text-orange-500">PROFE {coachFirstName.toUpperCase()}</span> 👋
          </h1>
          <div className="h-2 w-24 bg-orange-500 rounded-full mt-4 shadow-lg shadow-orange-500/20"></div>
          <p className="text-slate-500 mt-4 font-medium italic">Bienvenido a tu panel de gestión técnica, {coachFullName}.</p>
        </div>

        <div className="flex items-center gap-2 bg-white px-5 py-3 rounded-2xl border border-slate-200 shadow-sm text-xs font-black text-[#1e3a8a] uppercase tracking-widest">
          <Calendar size={18} className="text-orange-500" />
          {new Date().toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' }).toUpperCase()}
        </div>
      </div>

      {/* 2. Lista de Clases Real */}
      <div className="space-y-6">
        <h2 className="text-xl font-black text-[#1e3a8a] uppercase tracking-tight flex items-center gap-3">
            <div className="w-2 h-8 bg-[#1e3a8a] rounded-full"></div>
            Programación del Día
        </h2>

        <div className="grid gap-6">
          {clases.length > 0 ? (
            clases.map((item) => (
              <div key={item.id} className="group bg-white rounded-[2.5rem] p-7 border border-slate-100 shadow-xl hover:shadow-2xl transition-all flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden border-l-8 border-l-[#1e3a8a]">
                <div className="flex gap-6 relative z-10">
                  <div className={`hidden md:flex flex-col items-center justify-center w-24 h-24 rounded-[1.5rem] font-black shadow-inner transition-colors ${item.attended ? 'bg-slate-50 text-slate-300' : 'bg-[#1e3a8a] text-white'}`}>
                    <span className="text-2xl tracking-tighter">{item.time.split(':')[0]}</span>
                    <span className="text-[10px] uppercase tracking-widest opacity-60">HRS</span>
                  </div>

                  <div className="flex flex-col justify-center">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="bg-orange-50 text-orange-600 text-[10px] font-black px-3 py-1.5 rounded-xl uppercase tracking-widest border border-orange-100">
                        {item.level}
                      </span>
                      {item.attended && (
                        <span className="bg-blue-50 text-blue-700 text-[10px] font-black px-3 py-1.5 rounded-xl flex items-center gap-1.5 uppercase tracking-widest border border-blue-100">
                          <CheckCircle size={14} strokeWidth={3} /> COMPLETADO
                        </span>
                      )}
                    </div>
                    <h3 className="text-2xl font-black text-[#1e3a8a] uppercase tracking-tight italic group-hover:text-orange-600 transition-colors leading-none mb-3">
                      {item.title}
                    </h3>
                    <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-bold text-slate-400">
                      <span className="flex items-center gap-2"><Clock size={16} className="text-blue-400" /> {item.time}</span>
                      <span className="flex items-center gap-2"><MapPin size={16} className="text-blue-400" /> {item.court}</span>
                      <span className="flex items-center gap-2"><Users size={16} className="text-blue-400" /> {item.totalStudents} INSCRITOS</span>
                    </div>
                  </div>
                </div>

                <div className="relative z-10">
                  <button
                    onClick={() => handleOpenAttendance(item)}
                    disabled={item.attended}
                    className={`w-full md:w-auto px-10 py-5 rounded-[1.5rem] font-black text-xs transition-all flex items-center justify-center gap-3 uppercase tracking-widest shadow-xl active:scale-95 ${item.attended
                        ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
                        : 'bg-[#1e3a8a] text-white hover:bg-orange-500 hover:shadow-orange-500/30'
                      }`}
                  >
                    {item.attended ? 'LISTA CERRADA' : 'PASAR ASISTENCIA'}
                    {!item.attended && <ChevronRight size={18} />}
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white p-20 rounded-[3rem] border-2 border-dashed border-slate-200 text-center flex flex-col items-center">
               <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                  <Calendar size={32} className="text-slate-200" />
               </div>
               <p className="font-black text-slate-300 uppercase italic tracking-[0.2em] text-sm">
                No tienes sesiones programadas para hoy
              </p>
            </div>
          )}
        </div>
      </div>

      {selectedClass && (
        <AttendanceModal
          clase={selectedClass}
          onClose={() => setSelectedClass(null)}
          onRefresh={handleSaveAttendance}
        />
      )}

      <p className="text-center text-[10px] text-slate-300 font-black uppercase tracking-[0.4em] opacity-50 pt-20">
        Gema Performance System · Management
      </p>
    </div>
  );
};

const ChevronRight = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
    <path d="m9 18 6-6-6-6" />
  </svg>
);

export default DashboardTeacher;