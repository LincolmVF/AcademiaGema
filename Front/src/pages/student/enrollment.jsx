import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { apiFetch } from '../../interceptors/api';
import { useAuth } from '../../context/AuthContext';
import { Loader2, Send, ArrowLeft, MapPin, Clock, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';

import StudentEnrollment from '../../components/student/StudentEnrollment';
import OutstandingDebtAlert from '../../components/student/OutstandingDebtAlert';
import WeeklyTimeline from '../../components/student/WeeklyTimelineEnrollment';

const Enrollment = () => {
  const { user, userId } = useAuth();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [horarios, setHorarios] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [pendingPayment, setPendingPayment] = useState(null);
  const [sedeFilter, setSedeFilter] = useState('TODAS');
  const [diaFilter, setDiaFilter] = useState(1);

  useEffect(() => { if (userId) fetchInitialData(); }, [userId]);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const [resH, resC] = await Promise.all([apiFetch.get('/horarios'), apiFetch.get('/cuentaPorCobrar')]);
      const dataH = await resH.json();
      const dataC = await resC.json();
      if (resH.ok) setHorarios(dataH.data?.filter(h => h.activo) || []);
      if (resC.ok) setPendingPayment(dataC.data?.find(c => c.alumno_id === userId && c.estado === 'PENDIENTE'));
    } catch (e) { toast.error("Error de sincronización Gema"); }
    finally { setLoading(false); }
  };

  const agendaSeleccionada = useMemo(() => horarios.filter(h => selectedIds.includes(h.id)), [horarios, selectedIds]);

  const toggleSelection = (id) => {
    const claseNueva = horarios.find(h => h.id === id);
    if (!selectedIds.includes(id)) {
      const choque = agendaSeleccionada.find(h => {
        return h.dia_semana === claseNueva.dia_semana && (
          (claseNueva.hora_inicio >= h.hora_inicio && claseNueva.hora_inicio < h.hora_fin) ||
          (claseNueva.hora_fin > h.hora_inicio && claseNueva.hora_fin <= h.hora_fin) ||
          (h.hora_inicio >= claseNueva.hora_inicio && h.hora_inicio < claseNueva.hora_fin)
        );
      });

      if (choque) {
        return toast.custom((t) => (
          <div className={`${t.visible ? 'animate-enter' : 'animate-leave'} max-w-md w-full bg-[#1e3a8a] shadow-2xl rounded-[2rem] pointer-events-auto flex ring-4 ring-orange-500`}>
            <div className="flex-1 p-6 flex items-start">
              <div className="h-10 w-10 bg-orange-500 rounded-full flex items-center justify-center text-white shrink-0">
                <AlertTriangle size={24} />
              </div>
              <div className="ml-4">
                <p className="text-xs font-black text-white uppercase italic">Cruce de horario</p>
                <p className="text-[10px] font-bold text-blue-100 uppercase mt-1">Ya elegiste {choque.nivel?.nombre} en este bloque.</p>
              </div>
            </div>
          </div>
        ));
      }
    }
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  // ✅ MANEJO DE INSCRIPCIÓN CON ERROR DE SIMULTANEIDAD
  const handleEnrollment = async () => {
    if (selectedIds.length === 0) return toast.error("Selecciona tus clases");
    setSubmitting(true);
    try {
      const response = await apiFetch.post('/inscripciones', {
        alumno_id: userId,
        horario_ids: selectedIds
      });

      const result = await response.json();

      if (response.ok) {
        toast.success("¡Inscripción Gema Completada!");
        await fetchInitialData();
        setSelectedIds([]);
      } else {
        // Mostramos el mensaje exacto del backend (ej. "Límite de horarios simultáneos superado")
        toast.error(result.message || "Error al procesar la inscripción", {
          duration: 5000,
          style: { background: '#ef4444', color: '#fff', fontWeight: 'bold', borderRadius: '15px' }
        });
      }
    } catch (error) {
      toast.error("Error crítico de conexión");
    } finally {
      setSubmitting(false);
    }
  };

  const horariosFiltrados = useMemo(() => {
    return horarios.filter(h => (sedeFilter === 'TODAS' || h.cancha?.sede?.nombre === sedeFilter) && h.dia_semana === diaFilter);
  }, [horarios, sedeFilter, diaFilter]);

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-40 px-4 md:px-8">
      <div className="max-w-6xl mx-auto py-8">
        <header className="flex justify-between items-center mb-10">
          <div>
            <Link to="/dashboard/student" className="inline-flex items-center gap-2 text-slate-400 hover:text-[#1e3a8a] transition-all mb-4 text-[10px] font-black uppercase tracking-widest italic"><ArrowLeft size={14} /> Volver</Link>
            <h1 className="text-4xl font-black text-[#1e3a8a] italic uppercase tracking-tighter leading-none">
              Inscripción <span className="text-orange-500 italic">Temporada</span>
            </h1>
          </div>
        </header>

        <WeeklyTimeline agendaSeleccionada={agendaSeleccionada} />
        <OutstandingDebtAlert pendingPayment={pendingPayment} />

        <div className="flex flex-col md:flex-row gap-4 mb-10 items-center justify-between">
          <div className="flex bg-white p-2 rounded-full shadow-md border border-slate-100 overflow-x-auto w-full md:w-auto scrollbar-hide">
            {[1,2,3,4,5,6].map(d => (
              <button key={d} onClick={() => setDiaFilter(d)} className={`px-8 py-3 rounded-full text-[10px] font-black transition-all uppercase italic flex-shrink-0 ${diaFilter === d ? 'bg-[#1e3a8a] text-white shadow-xl' : 'text-slate-400 hover:text-[#1e3a8a]'}`}>
                {['LUNES','MARTES','MIÉRCOLES','JUEVES','VIERNES','SÁBADO'][d-1]}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-3 bg-[#1e3a8a] px-6 py-3 rounded-full shadow-lg">
            <MapPin size={16} className="text-orange-500" />
            <select value={sedeFilter} onChange={(e) => setSedeFilter(e.target.value)} className="text-[10px] font-black uppercase outline-none bg-transparent text-white cursor-pointer">
              <option value="TODAS" className="bg-[#1e3a8a]">FILTRAR POR SEDE</option>
              {[...new Set(horarios.map(h => h.cancha?.sede?.nombre))].map(s => <option key={s} value={s} className="bg-[#1e3a8a]">{s}</option>)}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {horariosFiltrados.map((h) => (
            <StudentEnrollment key={h.id} schedule={h} isSelected={selectedIds.includes(h.id)} onSelect={toggleSelection} />
          ))}
        </div>

        {!pendingPayment && (
          <div className="fixed bottom-10 inset-x-0 flex justify-center z-[110] px-4 pointer-events-none">
            <button 
              onClick={handleEnrollment} 
              disabled={selectedIds.length === 0 || submitting} 
              className={`pointer-events-auto flex items-center gap-4 px-12 py-6 rounded-full font-black uppercase italic transition-all duration-500 shadow-2xl ${selectedIds.length > 0 ? 'bg-orange-500 text-white hover:scale-110 active:scale-95' : 'bg-slate-200 text-slate-400 cursor-not-allowed'}`}
            >
              {submitting ? <Loader2 className="animate-spin" /> : <Send size={20} />}
              <span className="tracking-widest text-sm uppercase">Confirmar Matrícula ({selectedIds.length})</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Enrollment;