import React, { useEffect, useState } from 'react';
import { roleData } from '../data/mockDashboard';
import { apiFetch } from '../interceptors/api';
import { API_ROUTES } from '../constants/apiRoutes';
import { 
    TrendingUp, Activity, Zap, FileSpreadsheet, Home, 
    Wallet, MapPin, CreditCard, CalendarDays, BarChart2
} from 'lucide-react'; 
import * as XLSX from 'xlsx';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar
} from 'recharts';

const CHART_COLORS = ['#f97316', '#1e3a8a', '#3b82f6', '#facc15', '#fb923c', '#94a3b8'];

// Mapa de respaldo infalible para los métodos de pago
const MAPA_METODOS = {
    1: 'YAPE',
    2: 'PLIN',
    3: 'TRANSFERENCIA',
    4: 'EFECTIVO'
};

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
    const [actividad, setActividad] = useState(data?.activity || []);
    const [isExporting, setIsExporting] = useState(false);
    
    const [rawPagos, setRawPagos] = useState([]); 
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [availableYears, setAvailableYears] = useState([]);

    const [chartData, setChartData] = useState({
        ingresos: [],
        sedes: [],
        metodosPago: [],
        totalAlumnos: 0
    });

    const generarAñoCompleto = (año) => {
        const meses = ['ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN', 'JUL', 'AGO', 'SEP', 'OCT', 'NOV', 'DIC'];
        return meses.map((mes, idx) => ({ monthIndex: idx, year: año, mes, ingresos: 0 }));
    };

    useEffect(() => {
        if (role === 'admin') {
            const fetchDashboardData = async () => {
                try {
                    const [resStats, resPagos, resOcupacion] = await Promise.all([
                        apiFetch.get(API_ROUTES.USUARIOS.STATS),
                        apiFetch.get(API_ROUTES.PAGOS.BASE),
                        apiFetch.get(API_ROUTES.SEDES.OCUPACION)
                    ]);

                    const extractArray = (json) => Array.isArray(json?.data?.data) ? json.data.data : (Array.isArray(json?.data) ? json.data : (Array.isArray(json) ? json : []));

                    // 1. STATS Y ACTIVIDAD DINÁMICA (Lógica de tu compañero unificada)
                    const resultStats = resStats.ok ? await resStats.json() : {};
                    if (resStats.ok && resultStats.data) {
                        const d = resultStats.data;
                        setStats(prevStats => prevStats.map(stat => {
                            switch (stat.id) {
                                case "alumnos": return { ...stat, value: (d.alumno || 0).toString() };
                                case "coordinadores": return { ...stat, value: (d.coordinador || 0).toString() };
                                case "sedes": return { ...stat, value: (d.sedes || 0).toString() };
                                case "ingresos": return { ...stat, value: `S/ ${d.ingresosTotales || '0.00'}` };
                                case "pendientes": return { ...stat, value: `S/ ${d.deudaPendiente || '0.00'}` };
                                default: return stat;
                            }
                        }));

                        if (d.actividadReciente) {
                            setActividad(d.actividadReciente);
                        }
                    }

                    // 2. PROCESAMIENTO DE SEDES
                    const ocupacionJson = resOcupacion.ok ? await resOcupacion.json() : {};
                    let distribucionSedes = extractArray(ocupacionJson);
                    if(distribucionSedes.length === 0) distribucionSedes = [{ nombre: 'Sin Datos', valor: 1 }];
                    const alumnosActivosTotales = distribucionSedes.reduce((acc, curr) => acc + (curr.valor === 1 && curr.nombre === 'Sin Datos' ? 0 : curr.valor), 0);

                    // 3. PROCESAMIENTO DE PAGOS (Años disponibles)
                    const pagosJson = resPagos.ok ? await resPagos.json() : {};
                    const dPagos = extractArray(pagosJson);
                    
                    const años = new Set();
                    dPagos.forEach(p => {
                        if(p.fecha_pago) años.add(new Date(p.fecha_pago).getFullYear());
                    });
                    const arrayAños = Array.from(años).sort((a,b) => b - a);
                    if(arrayAños.length === 0) arrayAños.push(new Date().getFullYear());
                    
                    setAvailableYears(arrayAños);
                    setRawPagos(dPagos);

                    setChartData(prev => ({ ...prev, sedes: distribucionSedes, totalAlumnos: alumnosActivosTotales }));

                } catch (error) {
                    console.error("Error cargando analíticas:", error);
                }
            };
            fetchDashboardData();
        } else {
            setStats(data?.stats || []);
        }
    }, [role, data]);

    // Efecto 2: Recalcular gráficos cuando cambia el año seleccionado
    useEffect(() => {
        if(rawPagos.length === 0) return;

        const historialAnual = generarAñoCompleto(selectedYear);
        const metodosData = {};

        rawPagos.forEach(pago => {
            if (pago.estado_validacion === 'APROBADO' && pago.fecha_pago) {
                const datePago = new Date(pago.fecha_pago);
                const monto = parseFloat(pago.monto_pagado) || 0;

                if (datePago.getFullYear() === selectedYear) {
                    const mesIndex = datePago.getMonth();
                    historialAnual[mesIndex].ingresos += monto;

                    let nombreMetodo = pago.metodos_pago?.nombre 
                        ? pago.metodos_pago.nombre.toUpperCase() 
                        : MAPA_METODOS[pago.metodo_pago_id] || 'OTROS';
                    
                    metodosData[nombreMetodo] = (metodosData[nombreMetodo] || 0) + monto;
                }
            }
        });

        const metodosChart = Object.keys(metodosData)
            .map(key => ({ nombre: key, monto: metodosData[key] }))
            .filter(item => item.monto > 0)
            .sort((a, b) => b.monto - a.monto);

        setChartData(prev => ({
            ...prev,
            ingresos: historialAnual,
            metodosPago: metodosChart
        }));

    }, [rawPagos, selectedYear]);

    const handleExportExcel = async () => {
        try {
            setIsExporting(true);
            const response = await apiFetch.get(API_ROUTES.USUARIOS.REPORTE);
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
            toast.error(error.message);
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
            {/* ========================================================= */}
            {/* HEADER                                                    */}
            {/* ========================================================= */}
            <div className="mb-10 pt-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
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
                    <Link to="/" className="p-3 bg-white text-slate-400 hover:text-[#1e3a8a] border border-slate-100 rounded-2xl shadow-lg shadow-slate-200/40 transition-all hover:-translate-y-1">
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

            {/* ========================================================= */}
            {/* ACTO 1: EL CONTEXTO (KPIs GENERALES)                      */}
            {/* ========================================================= */}
            <div className="mb-14">
                <div className="flex items-center gap-3 mb-6">
                    <Activity className="text-orange-500" size={20}/>
                    <h2 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em]">Resumen Ejecutivo</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {stats.map((stat, index) => (
                        <StatCard key={index} {...stat} />
                    ))}
                </div>
            </div>

            {/* ========================================================= */}
            {/* ACTO 2: EL PROTAGONISTA (GRÁFICOS DE IMPACTO)             */}
            {/* ========================================================= */}
            <div className="mb-16 pt-8 border-t border-slate-200/60">
                <div className="mb-8">
                    <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight italic">
                        Inteligencia <span className="text-orange-500">Financiera y Operativa</span>
                    </h2>
                    <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-1">Métricas basadas en datos reales ({selectedYear})</p>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* 1. FLUJO DE CAJA (LINEAL) */}
                    <div className="lg:col-span-2 bg-white rounded-[2.5rem] border border-slate-100 shadow-[0_20px_60px_rgba(0,0,0,0.03)] p-8 flex flex-col relative z-20">
                        <div className="mb-6 flex justify-between items-start">
                            <div>
                                <h2 className="font-black text-[#1e3a8a] uppercase tracking-tight text-xl italic mb-1 flex items-center gap-2">
                                    <Wallet size={20} className="text-orange-500"/> Flujo de Caja Validado
                                </h2>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Ingresos Totales por Mes</p>
                            </div>

                            <div className="flex items-center bg-slate-50 border border-slate-100 rounded-xl px-3 py-2 cursor-pointer shadow-sm relative">
                                <CalendarDays size={16} className="text-[#1e3a8a] mr-2" />
                                <select 
                                    className="bg-transparent text-sm font-black text-[#1e3a8a] outline-none cursor-pointer appearance-none pr-4"
                                    value={selectedYear}
                                    onChange={(e) => setSelectedYear(Number(e.target.value))}
                                >
                                    {availableYears.map(year => (
                                        <option key={year} value={year}>{year}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div style={{ width: '100%', height: 280 }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={chartData.ingresos} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorIng" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#1e3a8a" stopOpacity={0.4}/>
                                            <stop offset="95%" stopColor="#1e3a8a" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis dataKey="mes" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 'bold' }} dy={10} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 'bold' }} tickFormatter={(val) => `S/${val}`} />
                                    <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px -5px rgb(0 0 0 / 0.1)'}} cursor={{ stroke: '#cbd5e1', strokeWidth: 1, strokeDasharray: '3 3' }}/>
                                    <Area type="monotone" dataKey="ingresos" stroke="#1e3a8a" strokeWidth={4} fillOpacity={1} fill="url(#colorIng)" activeDot={{ r: 6, fill: '#f97316', stroke: '#fff', strokeWidth: 2 }}/>
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* 2. OCUPACIÓN (DONA) */}
                    <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-[0_20px_60px_rgba(0,0,0,0.03)] p-8 flex flex-col">
                        <div className="mb-4">
                            <h2 className="font-black text-[#1e3a8a] uppercase tracking-tight text-xl italic mb-1 flex items-center gap-2">
                                <MapPin size={20} className="text-orange-500"/> Ocupación
                            </h2>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Alumnos Activos por Sede</p>
                        </div>
                        
                        <div style={{ width: '100%', height: 180, position: 'relative' }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie data={chartData.sedes} cx="50%" cy="50%" innerRadius={55} outerRadius={75} paddingAngle={5} dataKey="valor" stroke="none">
                                        {chartData.sedes.map((entry, idx) => (<Cell key={idx} fill={CHART_COLORS[idx % CHART_COLORS.length]} />))}
                                    </Pie>
                                    <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}/>
                                </PieChart>
                            </ResponsiveContainer>
                            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                <span className="text-3xl font-black text-[#1e3a8a] italic leading-none">{chartData.totalAlumnos}</span>
                                <span className="text-[10px] font-bold text-slate-400 uppercase">Totales</span>
                            </div>
                        </div>

                        <div className="mt-6 space-y-3">
                            {chartData.sedes.map((sede, idx) => (
                                <div key={idx} className="flex justify-between items-center text-xs">
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: CHART_COLORS[idx % CHART_COLORS.length] }}></div>
                                        <span className="text-slate-600 font-bold uppercase tracking-tight">{sede.nombre}</span>
                                    </div>
                                    <span className="font-black text-[#1e3a8a] bg-blue-50 px-2 py-0.5 rounded-lg">{sede.valor}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* 3. RECAUDACIÓN (BARRAS) */}
                    <div className="lg:col-span-3 bg-white rounded-[2.5rem] border border-slate-100 shadow-[0_20px_60px_rgba(0,0,0,0.03)] p-8 flex flex-col mt-4">
                        <div className="mb-6 flex justify-between items-start">
                            <div>
                                <h2 className="font-black text-[#1e3a8a] uppercase tracking-tight text-xl italic mb-1 flex items-center gap-2">
                                    <CreditCard size={20} className="text-orange-500"/> Estructura de Recaudación
                                </h2>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Distribución por Método de Pago</p>
                            </div>
                        </div>
                        
                        <div style={{ width: '100%', height: 260 }}>
                            {chartData.metodosPago.length > 0 ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={chartData.metodosPago} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                        <XAxis dataKey="nombre" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 'bold' }} dy={10} />
                                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 'bold' }} tickFormatter={(val) => `S/${val}`} />
                                        <Tooltip 
                                            cursor={{fill: '#f8fafc'}} 
                                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}} 
                                            formatter={(value) => [`S/ ${value.toLocaleString()}`, 'Total Recaudado']} 
                                        />
                                        <Bar dataKey="monto" radius={[10, 10, 0, 0]} barSize={40}>
                                            {chartData.metodosPago.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="h-full w-full flex items-center justify-center text-slate-400 font-bold text-sm uppercase bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
                                    No hay pagos registrados para este periodo
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* ========================================================= */}
            {/* ACTO 3: GESTIÓN OPERATIVA (MOVIMIENTO Y REPORTES)         */}
            {/* ========================================================= */}
            <div className="pt-10 border-t border-slate-200/60 mt-10">
                <div className="flex items-center gap-3 mb-8">
                    <BarChart2 className="text-orange-500" size={20}/>
                    <h2 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em]">Gestión Operativa</h2>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    <div className="lg:col-span-2 bg-white rounded-[2.5rem] border border-slate-100 shadow-[0_20px_60px_rgba(0,0,0,0.03)] overflow-hidden">
                        <div className="px-10 py-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-[#1e3a8a] rounded-2xl text-white"><Activity size={20} /></div>
                                <h2 className="font-black text-[#1e3a8a] uppercase tracking-tight text-xl italic">{data.recentTitle || 'Movimiento Reciente del Club'}</h2>
                            </div>
                        </div>
                        <div className="divide-y divide-slate-50">
                            {/* 🔥 LÓGICA DINÁMICA DE TU COMPAÑERO TOTALMENTE RESTAURADA 🔥 */}
                            {actividad?.map((item, idx) => (
                                <div key={item.id} className="px-10 py-6 flex items-center justify-between hover:bg-slate-50 transition-all group">
                                    <div className="flex items-center gap-6">
                                        <span className="text-2xl opacity-50 group-hover:opacity-100 transition-opacity">
                                            {item.type === 'pago' ? '💰' : item.type === 'alumno' ? '👥' : '✨'}
                                        </span>
                                        <span className="text-slate-700 font-bold group-hover:text-[#1e3a8a] transition-colors">{item.text}</span>
                                    </div>
                                    <span className="text-[10px] text-slate-400 font-black uppercase bg-white px-3 py-1.5 rounded-lg border border-slate-100">{item.date}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-[#1e3a8a] rounded-[2.5rem] p-10 text-white relative overflow-hidden flex flex-col justify-between shadow-[0_20px_60px_rgba(0,0,0,0.1)]">
                        <div className="absolute top-0 right-0 w-40 h-40 bg-orange-500/20 rounded-full -mr-16 -mt-16 blur-3xl"></div>
                        <div>
                            <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center mb-8 border border-white/10">
                                <FileSpreadsheet className="text-orange-400" size={28} />
                            </div>
                            <h3 className="text-2xl font-black italic uppercase leading-tight mb-4">Reporte <br /><span className="text-orange-400">Maestro</span></h3>
                            <p className="text-blue-100/70 text-sm leading-relaxed font-medium">Descarga la base de datos completa de operaciones: alumnos, historial de pagos validos y deudas pendientes de Gema.</p>
                        </div>
                        <button onClick={handleExportExcel} disabled={isExporting} className={`mt-10 w-full py-5 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] transition-all shadow-2xl flex items-center justify-center gap-3 ${isExporting ? 'bg-slate-500 cursor-not-allowed' : 'bg-orange-500 hover:bg-orange-600 hover:-translate-y-1 shadow-orange-950/40'}`}>
                            {isExporting ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <Zap size={16} fill="currentColor" />}
                            {isExporting ? 'Generando Excel...' : 'Exportar Base de Datos'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;