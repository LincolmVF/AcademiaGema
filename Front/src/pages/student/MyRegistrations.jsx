import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Clock, CheckCircle2, AlertCircle, XCircle, Trash2, 
  Loader2, Info, MapPin, Activity, Calendar, 
  Trophy, Star, Target, ArrowRight
} from 'lucide-react';
import apiFetch from '../../interceptors/api.js';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';

const DIAS_NOMBRES = {
  1: "LUNES", 2: "MARTES", 3: "MIÉRCOLES", 4: "JUEVES", 5: "VIERNES", 6: "SÁBADO", 0: "DOMINGO"
};

const MyRegistrations = () => {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const BASE_URL = import.meta.env.VITE_API_URL;

  const fetchRegistrations = async () => {
    try {
      setLoading(true);

      // 1. ELIMINAMOS 'BASE_URL' de la llamada. 
      // El interceptor ya sabe que debe ir a http://localhost:5000/api
      const profileRes = await apiFetch.get('/alumno/mi-perfil'); 
      const resultProfile = await profileRes.json();
      
      // Extraemos el ID 15 de la estructura de Paolo Guerrero
      const alumnoId = resultProfile.data?.id;

      if (alumnoId) {
        // 2. Usamos ruta relativa también aquí
        const res = await apiFetch.get(`/inscripciones/alumno/${alumnoId}`);
        const resultInsc = await res.json();
        
        if (res.ok) {
          setRegistrations(resultInsc.data || []);
        }
      }
    } catch (error) {
      console.error("Error en la petición:", error);
      toast.error("Error de comunicación con el servidor");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchRegistrations(); }, []);

  const formatTime = (isoString) => {
    if (!isoString) return "--:--";
    const date = new Date(isoString);
    return date.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit', hour12: true });
  };

  const handleFinalize = async (id) => {
    const result = await Swal.fire({
      title: '<span class="italic font-black uppercase text-[#1e3a8a]">¿Finalizar Ciclo?</span>',
      html: `
        <div class="text-left space-y-4 p-2">
          <div class="p-4 bg-orange-50 border-l-4 border-orange-500 rounded-r-2xl shadow-sm">
            <p class="text-[10px] font-black text-orange-700 uppercase italic mb-1">Nota de Seguridad:</p>
            <p class="text-sm text-orange-900 leading-relaxed">Tu salida es voluntaria. Las clases pagadas <b>se mantienen</b> hasta fin de mes, pero el cupo se liberará para nuevos atletas.</p>
          </div>
          <p class="text-xs text-slate-400 font-bold uppercase tracking-widest text-center">¿Confirmas tu retiro del horario?</p>
        </div>
      `,
      showCancelButton: true,
      confirmButtonColor: '#f97316',
      cancelButtonColor: '#cbd5e1',
      confirmButtonText: 'SÍ, FINALIZAR',
      cancelButtonText: 'MANTENER',
      customClass: { popup: 'rounded-[3rem] p-10 shadow-2xl border-4 border-white' }
    });

    if (result.isConfirmed) {
      try {
        const res = await apiFetch.patch(`/inscripciones/${id}/finalizar`);
        if (res.ok) {
          toast.success("Horario finalizado correctamente");
          fetchRegistrations();
        }
      } catch (error) { toast.error("Error al procesar"); }
    }
  };

  // Configuración de Estados con estilo Gema
  const STATE_CONFIG = {
    ACTIVO: { label: 'En Curso', icon: <Target size={14} />, color: 'bg-green-500', bg: 'bg-green-50' },
    PENDIENTE_PAGO: { label: 'Por Pagar', icon: <Clock size={14} />, color: 'bg-orange-500', bg: 'bg-orange-50' },
    'PEN-RECU': { label: 'Liquidación', icon: <Activity size={14} />, color: 'bg-blue-500', bg: 'bg-blue-50' },
    FINALIZADO: { label: 'Historial', icon: <XCircle size={14} />, color: 'bg-slate-400', bg: 'bg-slate-50' }
  };

  if (loading) return (
    <div className="flex h-[60vh] items-center justify-center">
      <Loader2 className="animate-spin text-orange-500" size={40} />
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-10 animate-fade-in-up pb-32">
      
      {/* HEADER DINÁMICO CON STATS */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-12">
        <div>
          <h2 className="text-4xl md:text-5xl font-black text-[#1e3a8a] uppercase italic tracking-tighter leading-none">
            Mis <span className="text-orange-500">Inscripciones</span>
          </h2>
          <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.4em] mt-3 italic">
            Expediente de Atleta Elite · Paolo Guerrero #15
          </p>
        </div>
        
        {/* Widget de Stats para que no se vea vacio */}
        <div className="flex gap-4">
          <StatBox icon={<Trophy className="text-orange-500" />} value={registrations.filter(r => r.estado === 'ACTIVO').length} label="Clases Activas" />
          <StatBox icon={<Star className="text-blue-500" />} value={registrations.length} label="Total Historial" />
        </div>
      </div>

      <div className="space-y-16">
        {Object.keys(STATE_CONFIG).map((status) => {
          const items = registrations.filter(r => r.estado === status);
          if (items.length === 0) return null;

          return (
            <section key={status} className="space-y-6 relative">
              <div className="flex items-center gap-4">
                <div className={`px-6 py-2 rounded-2xl flex items-center gap-3 text-xs font-black uppercase tracking-widest text-white shadow-lg ${STATE_CONFIG[status].color}`}>
                  {STATE_CONFIG[status].icon} {STATE_CONFIG[status].label}
                </div>
                <div className="flex-1 h-[2px] bg-slate-100"></div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {items.map((reg) => (
                  <div key={reg.id} className="group relative">
                    <div className="absolute inset-0 bg-slate-200 rounded-[3rem] translate-y-2 translate-x-1 group-hover:translate-y-1 transition-transform opacity-20"></div>
                    <div className="bg-white rounded-[3rem] p-8 border border-slate-100 shadow-xl relative overflow-hidden transition-all duration-500 hover:border-orange-200 hover:-translate-y-1">
                      
                      <div className="flex items-center gap-8 relative z-10">
                        {/* Icono de Calendario Circular */}
                        <div className="shrink-0 w-24 h-24 rounded-[2.5rem] bg-slate-50 flex flex-col items-center justify-center border border-slate-100 group-hover:bg-[#1e3a8a] transition-all duration-500 shadow-inner">
                          <span className="text-[9px] font-black text-slate-300 uppercase group-hover:text-blue-200 italic mb-1">Día</span>
                          <Calendar size={32} className="text-[#1e3a8a] group-hover:text-white transition-colors" />
                        </div>

                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="text-3xl font-black text-[#1e3a8a] uppercase italic tracking-tighter leading-none">
                                {DIAS_NOMBRES[reg.horarios_clases?.dia_semana] || 'HORARIO'}
                              </h4>
                              <div className="flex items-center gap-2 mt-3 text-slate-400">
                                <Clock size={14} className="text-orange-500" />
                                <span className="text-xs font-black uppercase italic tracking-widest">
                                  {formatTime(reg.horarios_clases?.hora_inicio)} - {formatTime(reg.horarios_clases?.hora_fin)}
                                </span>
                              </div>
                            </div>

                            {status === 'ACTIVO' && (
                              <button 
                                onClick={() => handleFinalize(reg.id)}
                                className="w-12 h-12 rounded-[1.2rem] bg-rose-50 text-rose-500 flex items-center justify-center hover:bg-rose-500 hover:text-white transition-all shadow-sm border border-rose-100 active:scale-90"
                              >
                                <Trash2 size={20} strokeWidth={2.5} />
                              </button>
                            )}
                          </div>

                          <div className="mt-6 flex flex-wrap gap-3">
                            <SmallBadge icon={<MapPin size={12} />} label={reg.horarios_clases?.canchas?.nombre} />
                            <SmallBadge icon={<Activity size={12} />} label={reg.horarios_clases?.niveles_entrenamiento?.nombre} />
                          </div>
                        </div>
                      </div>
                      
                      {/* Decoración de fondo */}
                      <img src="/logo.png" className="absolute -right-10 -bottom-10 w-40 opacity-[0.03] rotate-12 pointer-events-none group-hover:opacity-[0.06] transition-opacity" alt="" />
                    </div>
                  </div>
                ))}
              </div>
            </section>
          );
        })}
      </div>

      {registrations.length === 0 && (
        <div className="bg-white p-24 rounded-[4rem] text-center border-4 border-dashed border-slate-100 relative overflow-hidden">
          <div className="relative z-10">
            <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <AlertCircle size={40} className="text-slate-200" />
            </div>
            <h3 className="text-xl font-black text-slate-300 uppercase italic tracking-widest">Sin inscripciones activas</h3>
            <p className="text-xs text-slate-400 mt-2 mb-10 font-bold uppercase tracking-tighter">Tu historial de atleta está esperando por tu primer entrenamiento oficial.</p>
            <Link to="/dashboard/student/enrollment" className="inline-flex items-center gap-3 bg-[#1e3a8a] text-white px-10 py-5 rounded-[2rem] font-black italic text-sm uppercase tracking-[0.2em] hover:bg-orange-500 transition-all shadow-2xl shadow-blue-900/20">
              ¡Inscríbete Ahora! <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

/* --- Componentes UI Locales --- */

const StatBox = ({ icon, value, label }) => (
  <div className="bg-white px-6 py-4 rounded-[2rem] border border-slate-100 shadow-xl flex items-center gap-4 min-w-[160px]">
    <div className="p-3 bg-slate-50 rounded-2xl">{icon}</div>
    <div>
      <p className="text-2xl font-black text-[#1e3a8a] leading-none">{value}</p>
      <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest mt-1">{label}</p>
    </div>
  </div>
);

const SmallBadge = ({ icon, label }) => (
  <div className="flex items-center gap-2 bg-slate-50 text-[10px] font-black text-slate-500 uppercase px-4 py-2 rounded-xl border border-slate-100 italic tracking-tighter">
    <span className="text-orange-500">{icon}</span>
    {label || '---'}
  </div>
);

export default MyRegistrations;