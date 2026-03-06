import React, { useEffect, useState } from 'react';
import { roleData } from '../data/mockDashboard';
import apiFetch from '../interceptors/api';
import { API_ROUTES } from '../constants/apiRoutes';
// Se añade el icono Home
import { TrendingUp, Activity, Zap, FileSpreadsheet, Home, User, Clock, AlertCircle } from 'lucide-react'; 
import * as XLSX from 'xlsx';
import { Link } from 'react-router-dom'; // Importante para la redirección

const StatCard = ({ id, title, value, icon: Icon, color }) => {
    const colors = {
        blue: "from-blue-500/10 to-indigo-500/10 text-blue-700 border-blue-100",
        orange: "from-orange-500/10 to-amber-500/10 text-orange-600 border-orange-100",
        green: "from-emerald-500/10 to-teal-500/10 text-emerald-600 border-emerald-100",
        purple: "from-purple-500/10 to-fuchsia-500/10 text-purple-700 border-purple-100",
        gray: "from-slate-500/10 to-slate-700/10 text-slate-600 border-slate-200",
    };

    return (
        <div className="relative overflow-hidden bg-white p-7 rounded-[2rem] border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.1)] hover:-translate-y-2 transition-all duration-500 group">
            <div className={`absolute -right-4 -top-4 w-24 h-24 bg-gradient-to-br ${colors[color]} opacity-20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700`}></div>

            <div className="flex items-start justify-between relative z-10">
                <div className={`p-4 rounded-2xl bg-gradient-to-br ${colors[color]} border shadow-sm group-hover:rotate-6 transition-transform duration-300`}>
                    <Icon size={28} strokeWidth={2.2} />
                </div>
                <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-500 bg-emerald-50 px-2 py-1 rounded-full uppercase tracking-tighter">
                    <TrendingUp size={12} /> Live
                </span>
            </div>

            <div className="mt-6 relative z-10">
                <h3 className="text-slate-400 text-[11px] font-black uppercase tracking-[0.15em] mb-1">{title}</h3>
                <div className="flex items-baseline gap-2">
                    <p className="text-4xl font-black text-[#1e3a8a] tracking-tight">{value}</p>
                    <div className="h-2 w-2 rounded-full bg-orange-500 animate-pulse"></div>
                </div>
            </div>
        </div>
    );
};

const Dashboard = ({ role = 'student' }) => {
    const data = roleData[role];
    const [stats, setStats] = useState(data?.stats || []);
    const [isExporting, setIsExporting] = useState(false);

    useEffect(() => {
        if (role === 'admin') {
            const fetchDashboardStats = async () => {
                try {
                    const response = await apiFetch.get(API_ROUTES.USUARIOS.STATS);
                    const result = await response.json();

                    if (response.ok && result.data) {
                        const d = result.data;
                        setStats(prevStats =>
                            prevStats.map(stat => {
                                switch (stat.id) {
                                    case "alumnos": return { ...stat, value: (d.alumno || 0).toString() };
                                    case "coordinadores": return { ...stat, value: (d.coordinador || 0).toString() };
                                    case "sedes": return { ...stat, value: (d.sedes || 0).toString() };
                                    case "ingresos": return { ...stat, value: `S/ ${d.ingresosTotales || '0.00'}` };
                                    case "pendientes": return { ...stat, value: `S/ ${d.deudaPendiente || '0.00'}` };
                                    default: return stat;
                                }
                            })
                        );
                    }
                } catch (error) {
                    console.error("Error cargando estadísticas:", error);
                }
            };
            fetchDashboardStats();
        } else {
            setStats(data?.stats || []);
        }
    }, [role, data]);

    const handleExportExcel = async () => {
        try {
            setIsExporting(true);
            const response = await apiFetch.get(API_ROUTES.USUARIOS.REPORTE);

            const contentType = response.headers.get("content-type");
            if (!contentType || !contentType.includes("application/json")) {
                throw new Error("El servidor no respondió con datos válidos. Verifica la ruta en el Backend.");
            }

            const result = await response.json();
            if (!response.ok) throw new Error(result.message || "Error al obtener reporte");

            const reportData = result.data;
            const workbook = XLSX.utils.book_new();

            const alumnosWS = XLSX.utils.json_to_sheet(reportData.alumnos);
            XLSX.utils.book_append_sheet(workbook, alumnosWS, "Lista_Alumnos");

            const pagosWS = XLSX.utils.json_to_sheet(reportData.pagos);
            XLSX.utils.book_append_sheet(workbook, pagosWS, "Historial_Pagos");

            const deudasWS = XLSX.utils.json_to_sheet(reportData.deudas);
            XLSX.utils.book_append_sheet(workbook, deudasWS, "Cuentas_Pendientes");

            alumnosWS['!cols'] = [{ wch: 25 }, { wch: 30 }, { wch: 20 }];

            XLSX.writeFile(workbook, `Reporte_Gema_Detallado_${new Date().toISOString().split('T')[0]}.xlsx`);

        } catch (error) {
            console.error("Error exportando excel:", error);
            alert(error.message);
        } finally {
            setIsExporting(false);
        }
    };

    if (!data) return (
        <div className="flex flex-col items-center justify-center h-96 space-y-4">
            <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-slate-400 font-black uppercase text-xs tracking-widest animate-pulse">Sincronizando Club...</p>
        </div>
    );

    return (
        <div className="max-w-7xl mx-auto px-4 pb-20 animate-fade-in">
            {/* Header Moderno */}
            <div className="mb-12 pt-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <span className="bg-[#1e3a8a] text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">Gema Performance</span>
                        <div className="h-[1px] w-12 bg-slate-200"></div>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-[#1e3a8a] tracking-tighter uppercase italic">
                        Panel de <span className="text-orange-500">Control</span>
                    </h1>
                </div>

                <div className="flex items-center gap-4">
                    {/* BOTÓN IR AL INICIO */}
                    <Link 
                        to="/" 
                        className="p-3 bg-white text-slate-400 hover:text-[#1e3a8a] border border-slate-100 rounded-2xl shadow-lg shadow-slate-200/40 transition-all hover:-translate-y-1"
                        title="Ir al Inicio"
                    >
                        <Home size={22} />
                    </Link>

                    <div className="flex items-center gap-4 bg-white p-3 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/40">
                        <div className="h-10 w-10 rounded-2xl bg-orange-100 flex items-center justify-center text-orange-600 font-bold">A</div>
                        <div className="pr-4">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Operaciones</p>
                            <p className="text-xs font-bold text-slate-700">Administrador</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Grid de Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
                {stats.map((stat, index) => (
                    <StatCard key={index} {...stat} />
                ))}
            </div>

            {/* Fila de Actividad y Herramientas */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                <div className="lg:col-span-2 bg-white rounded-[2.5rem] border border-slate-100 shadow-[0_20px_60px_rgba(0,0,0,0.03)] overflow-hidden">
                    <div className="px-10 py-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-[#1e3a8a] rounded-2xl text-white">
                                <Activity size={20} />
                            </div>
                            <h2 className="font-black text-[#1e3a8a] uppercase tracking-tight text-xl italic">
                                {data.recentTitle || 'Actividad'}
                            </h2>
                        </div>
                    </div>

                    <div className="divide-y divide-slate-50">
                        {data.activity?.map((item, idx) => (
                            <div key={item.id} className="px-10 py-6 flex items-center justify-between hover:bg-slate-50 transition-all group">
                                <div className="flex items-center gap-6">
                                    <span className="text-2xl opacity-50 group-hover:opacity-100 transition-opacity">
                                        {idx === 0 ? '✨' : idx === 1 ? '💰' : '👥'}
                                    </span>
                                    <span className="text-slate-700 font-bold group-hover:text-[#1e3a8a] transition-colors">{item.text}</span>
                                </div>
                                <span className="text-[10px] text-slate-400 font-black uppercase bg-white px-3 py-1.5 rounded-lg border border-slate-100">{item.date}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-[#1e3a8a] rounded-[2.5rem] p-10 text-white relative overflow-hidden flex flex-col justify-between">
                    <div className="absolute top-0 right-0 w-40 h-40 bg-orange-500/20 rounded-full -mr-16 -mt-16 blur-3xl"></div>

                    <div>
                        <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center mb-8 border border-white/10">
                            <FileSpreadsheet className="text-orange-400" size={28} />
                        </div>
                        <h3 className="text-2xl font-black italic uppercase leading-tight mb-4">Reportes <br /><span className="text-orange-400">Ejecutivos</span></h3>
                        <p className="text-blue-100/70 text-sm leading-relaxed font-medium">
                            Descarga la base de datos completa de alumnos, historial de pagos y deudas pendientes en un solo archivo.
                        </p>
                    </div>

                    <button
                        onClick={handleExportExcel}
                        disabled={isExporting}
                        className={`mt-10 w-full py-5 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] transition-all shadow-2xl flex items-center justify-center gap-3 ${isExporting ? 'bg-slate-500 cursor-not-allowed' : 'bg-orange-500 hover:bg-orange-600 hover:-translate-y-1 shadow-orange-950/40'
                            }`}
                    >
                        {isExporting ? (
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                            <Zap size={16} fill="currentColor" />
                        )}
                        {isExporting ? 'Generando...' : 'Exportar Excel'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;