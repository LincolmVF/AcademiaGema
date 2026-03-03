import React, { useEffect, useState } from 'react';
import { roleData } from '../data/mockDashboard';
import apiFetch from '../interceptors/api';
import { TrendingUp, Activity, Zap, FileSpreadsheet } from 'lucide-react';
import * as XLSX from 'xlsx';

const StatCard = ({ title, value, icon: Icon, color }) => {
    const colors = {
        blue: "from-blue-500/10 to-indigo-500/10 text-blue-700 border-blue-100 icon-bg-blue",
        orange: "from-orange-500/10 to-amber-500/10 text-orange-600 border-orange-100 icon-bg-orange",
        green: "from-emerald-500/10 to-teal-500/10 text-emerald-600 border-emerald-100 icon-bg-green",
        purple: "from-purple-500/10 to-fuchsia-500/10 text-purple-700 border-purple-100 icon-bg-purple",
        gray: "from-slate-500/10 to-slate-700/10 text-slate-600 border-slate-200 icon-bg-gray",
    };

    return (
        <div className="relative overflow-hidden bg-white p-7 rounded-[2rem] border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.1)] hover:-translate-y-2 transition-all duration-500 group">
            {/* Decoración de fondo */}
            <div className={`absolute -right-4 -top-4 w-24 h-24 bg-gradient-to-br ${colors[color]} opacity-20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700`}></div>

            <div className="flex items-start justify-between relative z-10">
                <div className={`p-4 rounded-2xl bg-gradient-to-br ${colors[color]} border shadow-sm group-hover:rotate-6 transition-transform duration-300`}>
                    <Icon size={28} strokeWidth={2.2} />
                </div>
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
    const [rawStats, setRawStats] = useState(null); // Guardamos los datos puros para el excel

    useEffect(() => {
        if (role === 'admin') {
            const fetchDashboardStats = async () => {
                try {
                    const response = await apiFetch.get('/usuarios/count/usuarios-stats');
                    const result = await response.json();

                    if (response.ok && result.data) {
                        const d = result.data;
                        setRawStats(d); // Guardamos para el reporte
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

    // --- FUNCIÓN PARA GENERAR EXCEL ---
    const handleExportExcel = () => {
        if (!rawStats) return alert("No hay datos para exportar");

        // 1. Preparamos los datos en formato de filas
        const reporteData = [
            { Categoría: "Fecha de Reporte", Valor: new Date().toLocaleDateString() },
            { Categoría: "Total Alumnos", Valor: rawStats.alumno },
            { Categoría: "Total Coordinadores", Valor: rawStats.coordinador },
            { Categoría: "Sedes Activas", Valor: rawStats.sedes },
            { Categoría: "Ingresos Totales (S/)", Valor: rawStats.ingresosTotales },
            { Categoría: "Deuda Pendiente (S/)", Valor: rawStats.deudaPendiente },
            { Categoría: "Estado del Sistema", Valor: "Online" }
        ];

        const worksheet = XLSX.utils.json_to_sheet(reporteData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Resumen Mensual");

        worksheet["!cols"] = [{ wch: 25 }, { wch: 20 }];

        XLSX.writeFile(workbook, `Reporte_Gema_${new Date().getMonth() + 1}_${new Date().getFullYear()}.xlsx`);
    };

    if (!data) return (
        <div className="flex flex-col items-center justify-center h-96 space-y-4">
            <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-slate-400 font-black uppercase text-xs tracking-widest animate-pulse">Sincronizando Academia...</p>
        </div>
    );

    return (
        <div className="max-w-7xl mx-auto px-4 pb-20">
            {/* Header del Dashboard */}
            <div className="mb-12 pt-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="bg-[#1e3a8a] text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">Dashboard</span>
                            <div className="h-[1px] w-12 bg-slate-200"></div>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black text-[#1e3a8a] tracking-tighter uppercase italic">
                            Panel de <span className="text-orange-500">Control</span>
                        </h1>
                        <p className="text-slate-500 font-medium italic text-lg">
                            Gestión de alto rendimiento para el <span className="text-[#1e3a8a] font-bold not-italic">Club Gema</span>.
                        </p>
                    </div>

                    <div className="flex items-center gap-4 bg-white p-2 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/50">
                        <div className="flex -space-x-3 ml-4">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-slate-200 overflow-hidden">
                                    <img src={`https://i.pravatar.cc/150?u=${i + 10}`} alt="user" />
                                </div>
                            ))}
                        </div>
                        <div className="h-10 w-[1px] bg-slate-100"></div>
                        <div className="pr-6 pl-2">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Estado Sistema</p>
                            <div className="flex items-center gap-2">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                                </span>
                                <span className="text-xs font-bold text-slate-700">Online</span>
                            </div>
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

            {/* Sección Inferior: Actividad + Resumen */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Lista de Actividad */}
                <div className="lg:col-span-2 bg-white rounded-[2.5rem] border border-slate-100 shadow-[0_20px_60px_rgba(0,0,0,0.03)] overflow-hidden">
                    <div className="px-10 py-8 border-b border-slate-50 flex justify-between items-center">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-orange-500 rounded-2xl text-white shadow-lg shadow-orange-200">
                                <Activity size={20} />
                            </div>
                            <div>
                                <h2 className="font-black text-[#1e3a8a] uppercase tracking-tight text-xl italic">
                                    {data.recentTitle || 'Actividad Reciente'}
                                </h2>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Últimas 24 horas</p>
                            </div>
                        </div>
                        <button className="text-[10px] font-black text-[#1e3a8a] uppercase tracking-widest border-b-2 border-orange-500 pb-1 hover:text-orange-600 transition-colors">
                            Ver todo
                        </button>
                    </div>

                    <div className="p-4">
                        <div className="space-y-2">
                            {data.activity?.map((item, idx) => (
                                <div key={item.id} className="group px-6 py-5 flex items-center justify-between rounded-3xl hover:bg-slate-50 transition-all duration-300">
                                    <div className="flex items-center gap-5">
                                        <div className="w-12 h-12 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-xl shadow-sm group-hover:scale-110 transition-transform">
                                            {idx === 0 ? '🏆' : idx === 1 ? '💳' : '⚡'}
                                        </div>
                                        <div>
                                            <p className="text-slate-700 font-bold text-sm group-hover:text-[#1e3a8a] transition-colors">{item.text}</p>
                                            <p className="text-[10px] text-slate-400 font-medium">{item.date}</p>
                                        </div>
                                    </div>
                                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                        <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-[#1e3a8a]">
                                            <Zap size={14} fill="currentColor" />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Card de Soporte o Tip ràpido */}
                <div className="bg-[#1e3a8a] rounded-[2.5rem] p-10 text-white relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10 blur-3xl group-hover:bg-white/20 transition-colors"></div>
                    <div className="relative z-10 h-full flex flex-col justify-between">
                        <div>
                            <SparklesIcon />
                            <h3 className="text-2xl font-black italic uppercase leading-tight mb-4">
                                Potencia la <span className="text-orange-400">Academia</span>
                            </h3>
                            <p className="text-blue-100/70 text-sm leading-relaxed font-medium">
                                Los reportes de Excel incluyen el desglose actual de ingresos, deudas y personal activo.
                            </p>
                        </div>

                        <button
                            onClick={handleExportExcel} 
                            className="mt-8 bg-orange-500 hover:bg-orange-600 text-white font-black uppercase text-[10px] tracking-[0.2em] py-4 rounded-2xl transition-all shadow-xl shadow-orange-950/20 active:scale-95 flex items-center justify-center gap-2"
                        >
                            <FileSpreadsheet size={16} />
                            Generar Reporte Mensual
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const SparklesIcon = () => (
    <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mb-6">
        <Zap className="text-orange-400" size={24} fill="currentColor" />
    </div>
);

export default Dashboard;