import React, { useState, useEffect } from 'react';
import { apiFetch } from '../../interceptors/api';
import { useAuth } from '../../context/AuthContext';
import { Loader2, Send, CalendarCheck, MousePointer2 } from 'lucide-react';
import toast from 'react-hot-toast';

// Componentes Modulares
import StudentEnrollment from '../../components/student/StudentEnrollment';
import OutstandingDebtAlert from '../../components/student/OutstandingDebtAlert';

const Enrollment = () => {
  const { user } = useAuth(); //
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [horarios, setHorarios] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [pendingPayment, setPendingPayment] = useState(null);

  // Obtenemos el ID del alumno desde el contexto
  const alumnoId = user?.alumnos?.usuario_id || user?.id;

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      // Consultamos Horarios y Cuentas por Cobrar en paralelo
      const [resHorarios, resCuentas] = await Promise.all([
        apiFetch.get('/horarios'),
        apiFetch.get('/cuentaPorCobrar')
      ]);

      const dataHorarios = await resHorarios.json();
      const dataCuentas = await resCuentas.json();

      if (resHorarios.ok) {
        setHorarios(dataHorarios.data?.filter(h => h.activo) || []);
      }
      
      // Verificamos si este alumno específico tiene deudas PENDIENTES
      if (resCuentas.ok) {
        const deuda = dataCuentas.data?.find(
          c => c.alumno_id === alumnoId && c.estado === 'PENDIENTE'
        );
        setPendingPayment(deuda);
      }
    } catch (error) {
      toast.error("Error al sincronizar datos con la academia");
    } finally {
      setLoading(false);
    }
  };

  // Manejo de selección múltiple (Toggle)
  const toggleSelection = (id) => {
    setSelectedIds(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id) 
        : [...prev, id]
    );
  };

  const handleEnrollment = async () => {
    if (selectedIds.length === 0) return toast.error("Selecciona al menos un horario");
    if (pendingPayment) return toast.error("Debes regularizar tus pagos pendientes primero");

    setSubmitting(true);
    const payload = {
      alumno_id: parseInt(alumnoId),
      horario_ids: selectedIds
    };

    try {
      const response = await apiFetch.post('/inscripciones', payload);
      
      if (response.ok) {
        toast.success(`¡Inscripción registrada correctamente!`, {
            style: { borderRadius: '20px', background: '#1e3a8a', color: '#fff' }
        });
        // Refrescamos para detectar la nueva cuenta por cobrar generada
        await fetchInitialData(); 
        setSelectedIds([]);
      } else {
        const result = await response.json();
        toast.error(result.message || "Error al procesar la inscripción");
      }
    } catch (error) {
      toast.error("Error crítico de conexión");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
      <Loader2 className="animate-spin text-orange-500" size={48} strokeWidth={3} />
      <p className="font-black text-[#1e3a8a] uppercase italic text-xs tracking-widest">
        Verificando estado académico...
      </p>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-10 animate-fade-in-up pb-32">
      
      {/* Alerta de Deuda Pendiente (Componente Modular) */}
      <OutstandingDebtAlert pendingPayment={pendingPayment} />

      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <div className="flex items-center gap-3 mb-2 justify-center md:justify-start">
             <CalendarCheck className="text-[#1e3a8a]" size={32} />
             <h1 className="text-4xl font-black text-[#1e3a8a] uppercase tracking-tighter italic">
               Nueva <span className="text-orange-500">Inscripción</span>
             </h1>
          </div>
          <div className="h-1.5 w-32 bg-orange-500 rounded-full mx-auto md:mx-0 shadow-lg"></div>
          <p className="text-slate-400 mt-4 font-black uppercase text-[10px] tracking-[0.3em] flex items-center justify-center md:justify-start gap-2">
            <MousePointer2 size={12}/> Selecciona los días que deseas entrenar
          </p>
        </div>

        {/* Badge de Alumno */}
        <div className="hidden md:flex bg-white px-6 py-3 rounded-2xl border border-slate-100 shadow-sm items-center gap-4">
          <div className="text-right">
            <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest">Alumno Gema</p>
            <p className="text-sm font-bold text-[#1e3a8a]">{user?.nombres} {user?.apellidos}</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center font-black text-white">
            {user?.nombres?.charAt(0)}
          </div>
        </div>
      </header>

      {/* Grid de Horarios Disponibles */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {horarios.map((h) => (
          <StudentEnrollment 
            key={h.id} 
            schedule={h} 
            isSelected={selectedIds.includes(h.id)}
            onSelect={toggleSelection}
          />
        ))}
      </div>

      {/* Botón Flotante de Confirmación */}
      {/* Se deshabilita si hay deuda pendiente para forzar el flujo de pago */}
      {!pendingPayment && (
        <div className="fixed bottom-10 left-0 right-0 px-6 md:left-64 flex justify-center z-[100]">
          <button
            onClick={handleEnrollment}
            disabled={selectedIds.length === 0 || submitting}
            className={`group flex items-center gap-4 px-12 py-5 rounded-[2.5rem] font-black uppercase italic transition-all duration-500 shadow-2xl
              ${selectedIds.length > 0 && !submitting 
                ? 'bg-[#0f172a] text-white hover:bg-orange-600 scale-105 active:scale-95' 
                : 'bg-slate-200 text-slate-400 cursor-not-allowed opacity-80'}`}
          >
            {submitting ? <Loader2 className="animate-spin" size={24} /> : <Send size={24} />}
            <span className="text-lg">
              {submitting ? 'Inscribiendo...' : `Confirmar (${selectedIds.length})`}
            </span>
          </button>
        </div>
      )}
    </div>
  );
};

export default Enrollment;