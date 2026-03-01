import React, { useState, useEffect, useMemo } from 'react';
// Agrega DollarSign aquí (línea 2 aprox.)
import { Search, Loader2, User, ChevronRight, AlertCircle, Calendar, Filter, DollarSign } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { apiFetch } from '../../interceptors/api';
import AdminPaymentValidation from './AdminPaymentValidation';
import AdminPaymentStats from './AdminPaymentStats'; // Importamos el componente nuevo
import toast from 'react-hot-toast';

const AdminPaymentManager = () => {
    const [view, setView] = useState('list');
    const [loading, setLoading] = useState(true);
    const [payments, setPayments] = useState([]);
    const [selectedPayment, setSelectedPayment] = useState(null);

    // Filtros de búsqueda
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('PENDIENTE');

    // --- NUEVOS FILTROS DE FECHA ---
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());
    const [selectedMonth, setSelectedMonth] = useState('ALL');

    const fetchPayments = async () => {
        try {
            setLoading(true);
            const response = await apiFetch.get('/pagos');
            const result = await response.json();
            if (response.ok) setPayments(result.data || []);
        } catch (error) {
            toast.error("Error al sincronizar ingresos");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchPayments(); }, []);

    // 1. Lógica de Filtrado Principal (Año, Mes, Estado, Buscador)
    const filteredPayments = useMemo(() => {
        return payments.filter(p => {
            const date = new Date(p.fecha_pago);
            const yearMatch = date.getFullYear().toString() === selectedYear;
            const monthMatch = selectedMonth === 'ALL' || date.getMonth().toString() === selectedMonth;
            const statusMatch = statusFilter === '' || p.estado_validacion === statusFilter;

            const nombres = p.cuentas_por_cobrar?.alumnos?.usuarios?.nombres || '';
            const apellidos = p.cuentas_por_cobrar?.alumnos?.usuarios?.apellidos || '';
            const alumnoNombre = `${nombres} ${apellidos}`.toLowerCase();
            const searchMatch = searchTerm === '' ||
                alumnoNombre.includes(searchTerm.toLowerCase()) ||
                p.codigo_operacion?.toLowerCase().includes(searchTerm.toLowerCase());

            return yearMatch && monthMatch && statusMatch && searchMatch;
        });
    }, [payments, selectedYear, selectedMonth, statusFilter, searchTerm]);

    // 2. Lógica para el componente de Estadísticas
    const statsData = useMemo(() => {
        const mesesNombres = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
        const recaudacionMes = {};
        let pendientes = 0;

        // Solo procesamos lo que ya pasó el filtro de AÑO
        payments.forEach(p => {
            const date = new Date(p.fecha_pago);
            if (date.getFullYear().toString() !== selectedYear) return;

            if (p.estado_validacion === 'PENDIENTE') pendientes++;

            if (p.estado_validacion === 'APROBADO') {
                const mesIdx = date.getMonth();
                recaudacionMes[mesIdx] = (recaudacionMes[mesIdx] || 0) + parseFloat(p.monto_pagado);
            }
        });

        const chartData = mesesNombres.map((name, index) => ({
            name,
            total: recaudacionMes[index] || 0
        }));

        const totalAprobado = filteredPayments
            .filter(p => p.estado_validacion === 'APROBADO')
            .reduce((acc, curr) => acc + parseFloat(curr.monto_pagado), 0);

        return {
            chartData,
            totalAprobado,
            pendientes,
            maxRecaudacion: Math.max(...chartData.map(d => d.total), 1)
        };
    }, [payments, selectedYear, filteredPayments]);

    const getStatusStyle = (status) => {
        switch (status) {
            case 'APROBADO': return 'bg-green-100 text-green-600 border-green-200';
            case 'RECHAZADO': return 'bg-red-100 text-red-600 border-red-200';
            default: return 'bg-orange-100 text-orange-600 border-orange-200';
        }
    };

    if (view === 'detail' && selectedPayment) {
        return <AdminPaymentValidation paymentData={selectedPayment} onBack={() => { setView('list'); setSelectedPayment(null); }} onSuccess={fetchPayments} />;
    }

    return (
        <div className="space-y-6 animate-fade-in-up p-1 pb-20">
            <header className="flex justify-between items-center">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <div className="h-6 w-1 bg-orange-500 rounded-full"></div>
                        <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tight italic">
                            Gestión de <span className="text-[#1e3a8a]">Ingresos</span>
                        </h1>
                    </div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic ml-1">Monitor de pagos - Club Gema</p>
                </div>

                {/* Selector de Año Rápido */}
                <div className="flex bg-white p-1 rounded-xl border border-slate-200 shadow-sm">
                    {['2025', '2026'].map(year => (
                        <button
                            key={year}
                            onClick={() => setSelectedYear(year)}
                            className={`px-4 py-1.5 rounded-lg text-[10px] font-black transition-all ${selectedYear === year ? 'bg-[#1e3a8a] text-white shadow-md' : 'text-slate-400 hover:text-slate-600'}`}
                        >
                            {year}
                        </button>
                    ))}
                </div>
            </header>

            {/* DASHBOARD SEPARADO */}
            <AdminPaymentStats stats={statsData} />

            {/* BARRA DE FILTROS AVANZADA */}
            <div className="bg-white p-3 rounded-[2rem] border border-slate-200 shadow-sm flex flex-col xl:flex-row gap-3">
                <div className="flex-1 relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                        type="text"
                        placeholder="BUSCAR POR ALUMNO O CÓDIGO..."
                        className="w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-2xl text-[10px] font-black uppercase outline-none focus:ring-2 focus:ring-blue-500/20"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="flex flex-wrap gap-2">
                    {/* Filtro Mes */}
                    <div className="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-2xl border border-slate-100">
                        <Calendar size={14} className="text-slate-400" />
                        <select
                            className="bg-transparent text-[10px] font-black uppercase outline-none cursor-pointer text-slate-600"
                            value={selectedMonth}
                            onChange={(e) => setSelectedMonth(e.target.value)}
                        >
                            <option value="ALL">Todos los Meses</option>
                            {["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"].map((m, i) => (
                                <option key={i} value={i}>{m}</option>
                            ))}
                        </select>
                    </div>

                    {/* Filtro Estado */}
                    <div className="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-2xl border border-slate-100">
                        <Filter size={14} className="text-slate-400" />
                        <select
                            className="bg-transparent text-[10px] font-black uppercase outline-none cursor-pointer text-slate-600"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option value="">Cualquier Estado</option>
                            <option value="PENDIENTE">Pendientes</option>
                            <option value="APROBADO">Aprobados</option>
                            <option value="RECHAZADO">Rechazados</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* LISTADO DE PAGOS */}
            {loading ? (
                <div className="flex flex-col items-center justify-center py-24 gap-4">
                    <Loader2 className="animate-spin text-[#1e3a8a]" size={40} />
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    <AnimatePresence>
                        {filteredPayments.map((p) => (
                            <motion.div
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                key={p.id}
                                onClick={() => { setSelectedPayment(p); setView('detail'); }}
                                className="bg-white rounded-[2.5rem] border border-slate-200 p-6 hover:shadow-2xl hover:border-blue-300 transition-all duration-300 cursor-pointer group relative overflow-hidden"
                            >
                                <div className="flex justify-between items-start mb-6">
                                    <div className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase border shadow-sm ${getStatusStyle(p.estado_validacion)}`}>
                                        {p.estado_validacion}
                                    </div>
                                    <div className="p-2.5 bg-slate-50 rounded-2xl group-hover:bg-[#1e3a8a] group-hover:text-white transition-all duration-300">
                                        <ChevronRight size={18} />
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 bg-blue-50 text-[#1e3a8a] rounded-2xl group-hover:bg-[#1e3a8a] group-hover:text-white transition-colors duration-300">
                                            <User size={22} />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Alumno</p>
                                            <h3 className="text-sm font-black text-slate-800 truncate uppercase tracking-tighter italic">
                                                {p.cuentas_por_cobrar?.alumnos?.usuarios?.nombres} {p.cuentas_por_cobrar?.alumnos?.usuarios?.apellidos}
                                            </h3>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4">
                                        <div className="p-3 bg-orange-50 text-orange-600 rounded-2xl">
                                            <DollarSign size={22} />
                                        </div>
                                        <div>
                                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Monto Confirmado</p>
                                            <h3 className="text-xl font-black text-slate-900 italic tracking-tighter">
                                                S/ {parseFloat(p.monto_pagado).toFixed(2)}
                                            </h3>
                                        </div>
                                    </div>

                                    <div className="pt-4 border-t border-slate-100 flex justify-between items-center text-[9px] font-bold text-slate-400">
                                        <span className="bg-slate-100 px-2 py-1 rounded-lg text-[#1e3a8a] uppercase italic font-black">
                                            {p.metodos_pago?.nombre}
                                        </span>
                                        <span>{new Date(p.fecha_pago).toLocaleDateString('es-PE', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                                    </div>
                                </div>
                                <AlertCircle className="absolute -right-8 -bottom-8 text-slate-50 group-hover:text-blue-50/30 transition-colors duration-500" size={140} />
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}

            {filteredPayments.length === 0 && !loading && (
                <div className="text-center py-20 bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200">
                    <p className="text-xs font-black text-slate-400 uppercase italic">No se encontraron pagos para este filtro</p>
                </div>
            )}
        </div>
    );
};

export default AdminPaymentManager;