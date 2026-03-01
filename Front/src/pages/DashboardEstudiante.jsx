import React, { useState, useEffect, useMemo } from "react";
import { 
  Calendar, Filter, Loader2, Sparkles, 
  ChevronRight, ChevronLeft, Trophy, RefreshCcw, 
  Users, Gift, HeartPulse 
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { apiFetch } from "../interceptors/api";

import StudentStats from "../components/student/StudentStats";
import StudentSchedule from "../components/student/StudentSchedule";
import StudentPayments from "../components/student/StudentPayments";
import WeeklyTimeline from "../components/student/WeeklyTimelineDashboard";

// --- COMPONENTE CARRUSEL (BENEFICIOS GEMA) ---
const StudentAnnouncements = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const beneficios = [
    {
      id: 1,
      tipo: 'RECUPERACIÓN',
      titulo: 'Recupera tus clases faltantes',
      descripcion: 'Entrena 2-3 veces/semana y recupera hasta 2 clases. Si vas 4 veces, ¡recupera hasta 4! Tienes hasta el mes siguiente.',
      icon: <RefreshCcw size={28} />,
      gradient: 'from-[#1e3a8a] to-blue-600',
      badge: 'FLEXIBILIDAD'
    },
    {
      id: 2,
      tipo: 'REFERIDOS',
      titulo: 'Trae a un amigo y ahorra S/ 10',
      descripcion: 'Por cada referido que se inscriba, obtén un descuento directo en tu siguiente pago. ¡Sin límites!',
      icon: <Users size={28} />,
      gradient: 'from-orange-600 to-orange-400',
      badge: 'PROMO'
    },
    {
      id: 3,
      tipo: 'SALUD',
      titulo: 'Gestión de Lesiones',
      descripcion: '¿Te lesionaste? No pierdas tus clases. Podemos congelarlas para que las recuperes cuando estés al 100%.',
      icon: <HeartPulse size={28} />,
      gradient: 'from-red-600 to-red-400',
      badge: 'CUIDADO'
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev === beneficios.length - 1 ? 0 : prev + 1));
    }, 6000);
    return () => clearInterval(interval);
  }, [currentIndex]);

  const item = beneficios[currentIndex];

  return (
    <div className="w-full mb-10">
      <div className="flex items-center justify-between mb-4 text-[#1e3a8a]">
        <div className="flex items-center gap-2">
          <Gift size={18} className="text-orange-500" />
          <h2 className="font-black uppercase tracking-widest text-[10px] italic text-slate-500">Beneficios Exclusivos Gema</h2>
        </div>
      </div>

      <div className="relative overflow-hidden rounded-[2.5rem] shadow-2xl shadow-blue-900/10 border-4 border-white h-44 md:h-40">
        <div className={`absolute inset-0 bg-gradient-to-r ${item.gradient} transition-all duration-700`}></div>
        
        <div className="relative z-10 p-6 md:p-8 text-white flex items-center justify-between h-full">
          <div className="flex items-center gap-6">
            <div className="hidden md:flex w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl items-center justify-center border border-white/30 shadow-xl">
              {item.icon}
            </div>
            <div>
              <span className="text-[9px] font-black bg-white/20 px-2 py-0.5 rounded-full mb-2 inline-block tracking-tighter uppercase">
                {item.badge} • {item.tipo}
              </span>
              <h3 className="text-2xl md:text-3xl font-black italic uppercase leading-none mb-2 tracking-tighter">
                {item.titulo}
              </h3>
              <p className="text-xs md:text-sm font-medium opacity-90 max-w-md leading-tight">
                {item.descripcion}
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            <button 
              onClick={() => setCurrentIndex(currentIndex === 0 ? beneficios.length -1 : currentIndex - 1)}
              className="p-2 bg-black/10 hover:bg-black/20 rounded-full border border-white/10 transition-colors"
            >
              <ChevronLeft size={20} />
            </button>
            <button 
              onClick={() => setCurrentIndex(currentIndex === beneficios.length -1 ? 0 : currentIndex + 1)}
              className="p-2 bg-black/10 hover:bg-black/20 rounded-full border border-white/10 transition-colors"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
        
        <div className="absolute bottom-0 left-0 h-1 bg-black/20 w-full">
          <div 
            className="h-full bg-white transition-all duration-[6000ms] ease-linear"
            style={{ width: `${((currentIndex + 1) / beneficios.length) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
};

// --- DASHBOARD PRINCIPAL ---
const DashboardEstudiante = () => {
  const { user, userId } = useAuth();
  const [attendance, setAttendance] = useState([]);
  const [debts, setDebts] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filtroMes, setFiltroMes] = useState("TODOS");
  const [filtroAnio, setFiltroAnio] = useState(new Date().getFullYear().toString());

  const meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        const [resAsist, resDebts, resPay] = await Promise.all([
          apiFetch.get(`/asistencias/alumno/${userId}`),
          apiFetch.get("/cuentaPorCobrar"),
          apiFetch.get("/pagos"),
        ]);

        const dataAsist = await resAsist.json();
        const dataDebts = await resDebts.json();
        const dataPay = await resPay.json();

        setAttendance(dataAsist.data || []);
        setDebts((dataDebts.data || []).filter((d) => d.alumno_id === userId));
        setPayments((dataPay.data || []).filter((p) => p.cuentas_por_cobrar?.alumno_id === userId));
      } catch (error) {
        console.error("Error en Dashboard:", error);
      } finally {
        setLoading(false);
      }
    };
    if (userId) loadDashboardData();
  }, [userId]);

  const agendaParaTimeline = useMemo(() => {
    return attendance
      .filter(s => s?.inscripciones?.horarios_clases)
      .map(s => ({
        ...s.inscripciones.horarios_clases,
        id: s.id,
        nivel: s.inscripciones.horarios_clases.niveles_entrenamiento
      }));
  }, [attendance]);

  const firstName = user.user?.nombres || "Campeón";
  const fullName = user.user ? `${user.user.nombres} ${user.user.apellidos}` : "Alumno Gema";
  const initial = user.user?.nombres?.charAt(0).toUpperCase() || "G";

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#f1f5f9]">
      <Loader2 className="animate-spin text-orange-500 mb-4" size={48} />
      <p className="font-black text-[#1e3a8a] uppercase italic text-xs tracking-widest text-center">Sincronizando Club Gema...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f1f5f9] flex justify-center relative overflow-hidden">
      <div className="w-full md:max-w-6xl p-4 md:p-8 pb-28 relative z-10">
        
        {/* 1. HEADER */}
        <header className="flex justify-between items-start mb-8 mt-2">
          <div>
            <h1 className="text-3xl md:text-4xl font-black text-[#1e3a8a] tracking-tighter uppercase italic leading-none">
              Hola, <span className="text-orange-500">{firstName}</span> 👋
            </h1>
            <div className="h-1.5 w-20 bg-orange-500 rounded-full mt-3"></div>
            <p className="text-[10px] md:text-xs text-slate-500 font-bold mt-4 italic uppercase tracking-[0.2em] flex items-center gap-2">
              <Sparkles size={14} className="text-orange-400" />Centro de Alto Rendimiento
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden md:block text-right">
              <span className="block font-black text-[#1e3a8a] uppercase tracking-tight text-sm">{fullName}</span>
            </div>
            <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-[#1e40af] to-[#0f172a] rounded-2xl flex items-center justify-center text-white font-black border-2 border-white shadow-lg text-xl">
              {initial}
            </div>
          </div>
        </header>

        {/* 2. CARRUSEL DE BENEFICIOS */}
        <StudentAnnouncements />

        {/* 3. STATS */}
        <StudentStats attendance={attendance} />

        {/* 4. TIMELINE SEMANAL */}
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-4">
             <div className="w-1.5 h-4 bg-white rounded-full"></div>
             <h2 className="font-black uppercase tracking-tighter italic text-xs text-slate-700">Tu Horario de la Semana</h2>
          </div>
          <WeeklyTimeline agendaSeleccionada={agendaParaTimeline} />
        </div>

        {/* 5. GRID PRINCIPAL */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          <div className="lg:col-span-2 space-y-6">
            {/* Filtros */}
            <div className="flex flex-wrap items-center gap-4 bg-white/50 p-4 rounded-[2rem] border border-slate-200">
              <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-xl border border-slate-200">
                <Filter size={16} className="text-orange-500" />
                <select
                  value={filtroMes}
                  onChange={(e) => setFiltroMes(e.target.value)}
                  className="text-[10px] font-black uppercase tracking-widest text-[#1e3a8a] outline-none bg-transparent"
                >
                  <option value="TODOS">TODOS LOS MESES</option>
                  {meses.map((mes, idx) => <option key={idx} value={idx.toString()}>{mes.toUpperCase()}</option>)}
                </select>
              </div>
              <div className="flex items-center gap-3 bg-white px-5 py-2 rounded-xl border border-slate-200 font-black text-[10px] text-[#1e3a8a] italic uppercase">
                <Calendar size={14} className="text-orange-500" /> Ciclo {filtroAnio}
              </div>
            </div>

            <StudentSchedule attendance={attendance} filtroMes={filtroMes} filtroAnio={filtroAnio} />
          </div>

          {/* Columna Lateral - Administración de Pagos */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-[2.5rem] shadow-xl shadow-slate-200/60 border border-slate-50">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-1.5 h-4 bg-orange-500 rounded-full"></div>
                <h2 className="font-black text-[#1e3a8a] uppercase tracking-tighter italic text-xs">Administración de Pagos</h2>
              </div>
              <StudentPayments debts={debts} payments={payments} />
            </div>
          </div>
        </div>

        <p className="mt-16 text-center text-[9px] text-slate-300 font-black uppercase tracking-[0.5em] opacity-50 italic">
          CLUB GEMA | DESDE 2023
        </p>
      </div>
    </div>
  );
};

export default DashboardEstudiante;