import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Calendar, Filter, Loader2, Zap, Sparkles } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { apiFetch } from "../interceptors/api";

import StudentStats from "../components/student/StudentStats";
import StudentSchedule from "../components/student/StudentSchedule";
import StudentAnnouncements from "../components/student/StudentAnnouncements";
import StudentPayments from "../components/student/StudentPayments";
import WeeklyTimeline from "../components/student/WeeklyTimelineDashboard";

const DashboardEstudiante = () => {
  const { user, userId } = useAuth();
  const [attendance, setAttendance] = useState([]);
  const [debts, setDebts] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filtros de Auditoría y Temporada
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
        setPayments(
          (dataPay.data || []).filter(
            (p) => p.cuentas_por_cobrar?.alumno_id === userId,
          ),
        );
      } catch (error) {
        console.error("Error cargando rendimiento Gema:", error);
      } finally {
        setLoading(false);
      }
    };

    if (userId) loadDashboardData();
  }, [userId]);

  // ✅ PREPARACIÓN DE DATOS PARA EL TIMELINE
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
  const userRole = user.user?.rol?.nombre || "Estudiante";

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#f1f5f9]">
      <Loader2 className="animate-spin text-orange-500 mb-4" size={48} />
      <p className="font-black text-[#1e3a8a] uppercase italic text-xs tracking-widest">
        Sincronizando Rendimiento Gema...
      </p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f1f5f9] flex justify-center relative overflow-hidden">
      {/* Marca de agua de fondo */}
      <div className="absolute top-0 right-0 p-10 opacity-[0.03] pointer-events-none hidden xl:block">
        <img src="/logo.png" alt="" className="w-96 h-auto rotate-12" />
      </div>

      <div className="w-full md:max-w-6xl p-4 md:p-8 pb-28 relative z-10">
        
        {/* --- HEADER DINÁMICO RESTAURADO --- */}
        <header className="flex justify-between items-start mb-10 mt-2 bg-white md:bg-transparent p-5 md:p-0 rounded-[2.5rem] shadow-xl shadow-slate-200/50 md:shadow-none border border-slate-100 md:border-none">
          <div>
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-slate-400 hover:text-[#1e3a8a] transition-all mb-4 text-[10px] font-black uppercase tracking-widest group italic"
            >
              <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
              Volver al Inicio
            </Link>

            <h1 className="text-3xl md:text-4xl font-black text-[#1e3a8a] tracking-tighter uppercase italic leading-none">
              Hola, <span className="text-orange-500">{firstName}</span> 👋
            </h1>
            <div className="h-1.5 w-20 bg-orange-500 rounded-full mt-3 shadow-lg shadow-orange-500/20"></div>
            <p className="text-xs md:text-sm text-slate-500 font-bold mt-4 italic uppercase tracking-wider flex items-center gap-2">
              <Sparkles size={14} className="text-orange-400" /> Academia Gema <span className="text-slate-300 mx-2">|</span> Centro de Alto Rendimiento
            </p>
          </div>

          <div className="flex items-center gap-4 group cursor-pointer">
            <div className="hidden md:block text-right">
              <span className="block font-black text-[#1e3a8a] uppercase tracking-tight leading-tight group-hover:text-orange-600 transition-colors">
                {fullName}
              </span>
              <span className="inline-block px-2 py-0.5 bg-orange-100 text-orange-600 text-[9px] font-black uppercase tracking-widest rounded-lg mt-1">
                {userRole}
              </span>
            </div>
            <div className="relative">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-[#1e40af] to-[#0f172a] rounded-2xl flex items-center justify-center text-white font-black shadow-lg shadow-blue-900/30 border-2 border-white group-hover:rotate-6 transition-all text-xl">
                {initial}
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
            </div>
          </div>
        </header>

        {/* --- WEEKLY TIMELINE EQUILIBRADO --- */}
        <WeeklyTimeline agendaSeleccionada={agendaParaTimeline} />

        {/* --- BARRA DE FILTROS DE AUDITORÍA --- */}
        <div className="flex flex-wrap items-center gap-4 bg-white/50 p-4 rounded-[2rem] border border-slate-200 backdrop-blur-sm mb-8">
          <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm">
            <Filter size={16} className="text-orange-500" />
            <select 
              value={filtroMes} 
              onChange={(e) => setFiltroMes(e.target.value)}
              className="text-[10px] font-black uppercase tracking-widest text-[#1e3a8a] outline-none cursor-pointer bg-transparent"
            >
              <option value="TODOS">VER TODOS LOS MESES</option>
              {meses.map((mes, idx) => <option key={idx} value={idx.toString()}>{mes.toUpperCase()}</option>)}
            </select>
          </div>

          <div className="flex items-center gap-3 bg-white px-5 py-2 rounded-xl border border-slate-200 shadow-sm font-black text-[10px] text-[#1e3a8a] italic">
             <Calendar size={14} className="text-orange-500" />
             TEMPORADA {filtroAnio}
          </div>
        </div>

        {/* Estadísticas de Rendimiento */}
        <StudentStats attendance={attendance} />

        {/* Grid Principal */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          <div className="lg:col-span-2">
            <StudentSchedule 
              attendance={attendance} 
              filtroMes={filtroMes} 
              filtroAnio={filtroAnio} 
            />
          </div>

          <div className="space-y-8 h-full">
            <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/60 border border-slate-50 flex flex-col h-full">
              <StudentAnnouncements />

              <div className="mt-8 pt-8 border-t border-slate-100">
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-1.5 h-5 bg-orange-500 rounded-full"></div>
                  <h2 className="font-black text-[#1e3a8a] uppercase tracking-tighter italic text-sm">
                    Estado de Cuenta
                  </h2>
                </div>
                <StudentPayments debts={debts} payments={payments} />
              </div>
            </div>
          </div>
        </div>

        <p className="mt-16 text-center text-[9px] text-slate-300 font-black uppercase tracking-[0.5em] opacity-50 italic">
          High Performance Management System · Club Gema 2026
        </p>
      </div>
    </div>
  );
};

export default DashboardEstudiante;