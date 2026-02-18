import React, { useState, useEffect, useMemo } from "react";
import { Calendar, Filter, Loader2, Sparkles, Zap } from "lucide-react";
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
      <p className="font-black text-[#1e3a8a] uppercase italic text-xs tracking-widest text-center">Sincronizando Academia Gema...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f1f5f9] flex justify-center relative overflow-hidden">
      <div className="w-full md:max-w-6xl p-4 md:p-8 pb-28 relative z-10">
        
        {/* 1. HEADER */}
        <header className="flex justify-between items-start mb-8 mt-2 bg-white md:bg-transparent p-5 md:p-0 rounded-[2.5rem] shadow-xl shadow-slate-200/50 md:shadow-none border border-slate-100 md:border-none">
          <div>
            <h1 className="text-3xl md:text-4xl font-black text-[#1e3a8a] tracking-tighter uppercase italic leading-none">
              Hola, <span className="text-orange-500">{firstName}</span> 👋
            </h1>
            <div className="h-1.5 w-20 bg-orange-500 rounded-full mt-3 shadow-lg shadow-orange-500/20"></div>
            <p className="text-xs md:text-sm text-slate-500 font-bold mt-4 italic uppercase tracking-wider flex items-center gap-2">
              <Sparkles size={14} className="text-orange-400" />Centro de Alto Rendimiento
            </p>
          </div>
          <div className="flex items-center gap-4 group">
            <div className="hidden md:block text-right">
              <span className="block font-black text-[#1e3a8a] uppercase tracking-tight leading-tight">{fullName}</span>
            </div>
            <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-[#1e40af] to-[#0f172a] rounded-2xl flex items-center justify-center text-white font-black border-2 border-white shadow-lg text-xl">
              {initial}
            </div>
          </div>
        </header>

        {/* 2. STATS (Arriba del todo como pediste) */}
        <StudentStats attendance={attendance} />

        {/* 3. TIMELINE SEMANAL */}
        <div className="mb-10">
          <WeeklyTimeline agendaSeleccionada={agendaParaTimeline} />
        </div>

        {/* 4. GRID PRINCIPAL */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Columna Principal (Izquierda) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Filtros */}
            <div className="flex flex-wrap items-center gap-4 bg-white/50 p-4 rounded-[2rem] border border-slate-200 backdrop-blur-sm">
              <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm">
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
              <div className="flex items-center gap-3 bg-white px-5 py-2 rounded-xl border border-slate-200 shadow-sm font-black text-[10px] text-[#1e3a8a] italic uppercase">
                <Calendar size={14} className="text-orange-500" /> Ciclo {filtroAnio}
              </div>
            </div>

            {/* Plan de Entrenamiento */}
            <StudentSchedule attendance={attendance} filtroMes={filtroMes} filtroAnio={filtroAnio} />
          </div>

          {/* Columna Lateral (Derecha) - Beneficios y Pagos juntos */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-[2.5rem] shadow-xl shadow-slate-200/60 border border-slate-50">
              
              {/* Beneficios Gema (Carrusel compacto) */}
              <StudentAnnouncements />

              <div className="my-8 border-t border-slate-100 relative">
                <span className="absolute -top-2 left-1/2 -translate-x-1/2 bg-white px-3 text-[8px] font-black text-slate-300 uppercase tracking-widest italic">Administración</span>
              </div>

              {/* Estado de Cuenta */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-4 bg-orange-500 rounded-full"></div>
                  <h2 className="font-black text-[#1e3a8a] uppercase tracking-tighter italic text-xs">Pagos y Deudas</h2>
                </div>
                <StudentPayments debts={debts} payments={payments} />
              </div>
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