import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { apiFetch } from '../../interceptors/api';
import { useAuth } from '../../context/AuthContext';
import { Loader2, Send, CalendarCheck, MousePointer2, ArrowLeft, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';

// Componentes Modulares
import StudentEnrollment from '../../components/student/StudentEnrollment';
import OutstandingDebtAlert from '../../components/student/OutstandingDebtAlert';

const Enrollment = () => {
  const { user, userId } = useAuth();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [horarios, setHorarios] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [pendingPayment, setPendingPayment] = useState(null);

  useEffect(() => {
    if (userId) fetchInitialData();
  }, [userId]);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const [resHorarios, resCuentas] = await Promise.all([
        apiFetch.get('/horarios'),
        apiFetch.get('/cuentaPorCobrar')
      ]);

      const dataHorarios = await resHorarios.json();
      const dataCuentas = await resCuentas.json();

      if (resHorarios.ok) {
        setHorarios(dataHorarios.data?.filter(h => h.activo) || []);
      }

      if (resCuentas.ok) {
        const deuda = dataCuentas.data?.find(
          c => c.alumno_id === userId && c.estado === 'PENDIENTE'
        );
        setPendingPayment(deuda);
      }
    } catch (error) {
      toast.error("Error al sincronizar datos");
    } finally {
      setLoading(false);
    }
  };

  const toggleSelection = (id) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleEnrollment = async () => {
    if (selectedIds.length === 0) return toast.error("Selecciona al menos un horario");
    if (pendingPayment) return toast.error("Regulariza tus deudas pendientes");

    setSubmitting(true);
    try {
      const response = await apiFetch.post('/inscripciones', {
        alumno_id: userId,
        horario_ids: selectedIds
      });

      if (response.ok) {
        toast.success(`¡Inscripción registrada!`, {
          style: { borderRadius: '20px', background: '#1e3a8a', color: '#fff', fontWeight: 'bold' }
        });
        await fetchInitialData();
        setSelectedIds([]);
      } else {
        const result = await response.json();
        toast.error(result.message || "Error al procesar");
      }
    } catch (error) {
      toast.error("Error de conexión");
    } finally {
      setSubmitting(false);
    }
  };

  // Variables de estilo del Dashboard
  const fullName = user.user ? `${user.user.nombres} ${user.user.apellidos}` : "Alumno Gema";
  const initial = user.user?.nombres?.charAt(0).toUpperCase() || "G";
  const rol = user.user?.rol || "Alumno";

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#f1f5f9]">
      <Loader2 className="animate-spin text-orange-500 mb-4" size={48} />
      <p className="font-black text-[#1e3a8a] uppercase italic text-xs tracking-widest">
        Cargando cupos disponibles...
      </p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f1f5f9] flex justify-center relative overflow-hidden">
      {/* Marca de agua */}
      <div className="absolute top-0 right-0 p-10 opacity-[0.03] pointer-events-none hidden xl:block">
        <img src="/logo.png" alt="" className="w-96 h-auto -rotate-12" />
      </div>

      <div className="w-full md:max-w-6xl p-4 md:p-8 pb-32 relative z-10">

        {/* --- HEADER ESTILO DASHBOARD --- */}
        <header className="flex justify-between items-start mb-10 mt-2 bg-white md:bg-transparent p-5 md:p-0 rounded-[2.5rem] shadow-xl shadow-slate-200/50 md:shadow-none border border-slate-100 md:border-none">
          <div>
            <Link
              to="/dashboard/student"
              className="inline-flex items-center gap-2 text-slate-400 hover:text-[#1e3a8a] transition-all mb-4 text-[10px] font-black uppercase tracking-widest group"
            >
              <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
              Panel de Control
            </Link>

            <h1 className="text-3xl md:text-4xl font-black text-[#1e3a8a] tracking-tighter uppercase italic leading-none">
              Nueva <span className="text-orange-500">Inscripción</span>
            </h1>
            <div className="h-1.5 w-20 bg-orange-500 rounded-full mt-3 shadow-lg"></div>
            <p className="text-xs md:text-sm text-slate-500 font-bold mt-4 italic uppercase tracking-wider flex items-center gap-2">
              <Sparkles size={14} className="text-orange-400" /> Elige tus horarios de entrenamiento
            </p>
          </div>

          <div className="flex items-center gap-4 group cursor-pointer">
            <div className="hidden md:block text-right">
              <span className="block font-black text-[#1e3a8a] uppercase tracking-tight leading-tight group-hover:text-orange-600 transition-colors">
                {fullName}
              </span>
              <span className="inline-block px-2 py-0.5 bg-blue-100 text-blue-600 text-[9px] font-black uppercase tracking-widest rounded-lg mt-1">
                Rol: {rol}
              </span>
            </div>
            <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-[#1e40af] to-[#0f172a] rounded-2xl flex items-center justify-center text-white font-black shadow-lg border-2 border-white text-xl">
              {initial}
            </div>
          </div>
        </header>

        {/* Alerta de Deuda */}
        <div className="mb-10">
          <OutstandingDebtAlert pendingPayment={pendingPayment} />
        </div>

        {/* Grid de Horarios - Estética Cards Blancas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {horarios.map((h) => (
            <div key={h.id} className="transition-all hover:-translate-y-1">
              <StudentEnrollment
                schedule={h}
                isSelected={selectedIds.includes(h.id)}
                onSelect={toggleSelection}
              />
            </div>
          ))}
        </div>

        {/* Mensaje Informativo si no hay horarios */}
        {horarios.length === 0 && (
          <div className="bg-white p-12 rounded-[2.5rem] shadow-xl text-center border border-slate-100">
            <CalendarCheck className="mx-auto text-slate-200 mb-4" size={64} />
            <p className="font-black text-slate-400 uppercase italic tracking-widest">No hay horarios disponibles en este momento</p>
          </div>
        )}

        {/* --- BOTÓN FLOTANTE ESTILO GEMA --- */}
        {!pendingPayment && (
          <div className="fixed bottom-8 left-0 right-0 px-6 md:left-64 flex justify-center z-[100]">
            <button
              onClick={handleEnrollment}
              disabled={selectedIds.length === 0 || submitting}
              className={`group flex items-center gap-4 px-10 py-5 rounded-[2.2rem] font-black uppercase italic transition-all duration-500 shadow-[0_20px_50px_rgba(0,0,0,0.15)]
                ${selectedIds.length > 0 && !submitting
                  ? 'bg-gradient-to-r from-[#1e3a8a] to-[#0f172a] text-white hover:scale-105 active:scale-95'
                  : 'bg-white text-slate-300 border border-slate-100 cursor-not-allowed opacity-80'}`}
            >
              {submitting ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <Send size={20} className={selectedIds.length > 0 ? "text-orange-500" : ""} />
              )}
              <span className="tracking-widest text-sm">
                {submitting ? 'Procesando...' : `Confirmar Matrícula (${selectedIds.length})`}
              </span>
            </button>
          </div>
        )}

        <p className="mt-16 text-center text-[9px] text-slate-300 font-black uppercase tracking-[0.4em] opacity-50 italic">
          High Performance Management System · Club Gema 2026
        </p>
      </div>
    </div>
  );
};

export default Enrollment;