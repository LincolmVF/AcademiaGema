import React, { useState, useMemo } from 'react';
import { Search, Loader2, DollarSign, Clock, User, ChevronRight, CheckCircle, XCircle, AlertCircle, TrendingUp } from 'lucide-react';
import AdminPaymentValidation from './AdminPaymentValidation';

const AdminPaymentManager = () => {
    const [view, setView] = useState('list');
    const [loading, setLoading] = useState(false);
    const [selectedPayment, setSelectedPayment] = useState(null);

    // --- DATOS MOCKUP (SIMULACIÓN DE API) ---
    const [payments, setPayments] = useState([
        {
            id: 1,
            codigo_operacion: 'TRX-99281',
            monto_pagado: '150.00',
            fecha_pago: '2024-05-20T10:00:00Z',
            estado_validacion: 'PENDIENTE',
            url_comprobante: 'https://images.unsplash.com/photo-1554224155-1696413575b9?auto=format&fit=crop&q=80&w=500',
            metodos_pago: { nombre: 'Transferencia BCP' },
            cuentas_por_cobrar: {
                catalogo_conceptos: { nombre: 'Mensualidad Junio - Voley' },
                alumnos: { usuarios: { nombres: 'Camila', apellidos: 'Pérez García' } }
            }
        },
        {
            id: 2,
            codigo_operacion: 'TRX-88120',
            monto_pagado: '85.00',
            fecha_pago: '2024-05-19T15:30:00Z',
            estado_validacion: 'PENDIENTE',
            url_comprobante: 'https://images.unsplash.com/photo-1583521214690-73421a1829a9?auto=format&fit=crop&q=80&w=500',
            metodos_pago: { nombre: 'Yape' },
            cuentas_por_cobrar: {
                catalogo_conceptos: { nombre: 'Inscripción Torneo Invierno' },
                alumnos: { usuarios: { nombres: 'Rodrigo', apellidos: 'Villanueva' } }
            }
        },
        {
            id: 3,
            codigo_operacion: 'TRX-77123',
            monto_pagado: '200.00',
            fecha_pago: '2024-05-18T09:15:00Z',
            estado_validacion: 'APROBADO',
            url_comprobante: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?auto=format&fit=crop&q=80&w=500',
            metodos_pago: { nombre: 'Plin' },
            cuentas_por_cobrar: {
                catalogo_conceptos: { nombre: 'Pack 12 Clases' },
                alumnos: { usuarios: { nombres: 'Lucía', apellidos: 'Mendoza' } }
            }
        }
    ]);

    // Filtros
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('PENDIENTE');

    const filteredPayments = useMemo(() => {
        return payments.filter(p => {
            const matchesStatus = statusFilter === '' || p.estado_validacion === statusFilter;
            const alumnoNombre = `${p.cuentas_por_cobrar?.alumnos?.usuarios?.nombres} ${p.cuentas_por_cobrar?.alumnos?.usuarios?.apellidos}`.toLowerCase();
            const matchesSearch = searchTerm === '' || 
                                alumnoNombre.includes(searchTerm.toLowerCase()) || 
                                p.codigo_operacion?.toLowerCase().includes(searchTerm.toLowerCase());
            return matchesStatus && matchesSearch;
        });
    }, [payments, statusFilter, searchTerm]);

    const handleOpenDetail = (payment) => {
        setSelectedPayment(payment);
        setView('detail');
    };

    const getStatusStyle = (status) => {
        switch (status) {
            case 'APROBADO': return 'bg-green-100 text-green-600 border-green-200';
            case 'RECHAZADO': return 'bg-red-100 text-red-600 border-red-200';
            default: return 'bg-orange-100 text-orange-600 border-orange-200';
        }
    };

    if (view === 'detail') {
        return (
            <AdminPaymentValidation 
                paymentData={selectedPayment} 
                onBack={() => {
                    setView('list');
                    setSelectedPayment(null);
                }}
                onSuccess={() => {
                    // Simulación de actualización local tras aprobar/rechazar
                    toast.success("Estado actualizado en el Mock");
                }}
            />
        );
    }

    return (
        <div className="space-y-6 animate-fade-in-up p-1">
            {/* Header con estadísticas rápidas */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <div className="h-6 w-1 bg-[#1e3a8a] rounded-full"></div>
                        <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tight">
                            Gestión de <span className="text-[#1e3a8a]">Ingresos</span>
                        </h1>
                    </div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic ml-3">
                        Monitor de transacciones entrantes
                    </p>
                </div>
                
                <div className="flex gap-3 w-full md:w-auto">
                    <div className="bg-white px-4 py-2 rounded-2xl border border-slate-200 flex items-center gap-3 shadow-sm">
                        <div className="p-2 bg-orange-50 text-orange-600 rounded-lg">
                            <Clock size={16} />
                        </div>
                        <div>
                            <p className="text-[8px] font-black text-slate-400 uppercase leading-none">Pendientes</p>
                            <p className="text-sm font-black text-slate-800">{payments.filter(p => p.estado_validacion === 'PENDIENTE').length}</p>
                        </div>
                    </div>
                    <div className="bg-[#1e3a8a] px-4 py-2 rounded-2xl text-white flex items-center gap-3 shadow-lg shadow-blue-900/20">
                        <div className="p-2 bg-white/10 text-blue-200 rounded-lg">
                            <TrendingUp size={16} />
                        </div>
                        <div>
                            <p className="text-[8px] font-black text-blue-200 uppercase leading-none">Hoy</p>
                            <p className="text-sm font-black italic">S/ 435.00</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Barra de Filtros */}
            <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input
                        type="text"
                        placeholder="Alumno o código de operación..."
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border-none rounded-2xl text-xs font-bold outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <select
                    className="bg-slate-50 border-none rounded-2xl px-4 py-2.5 text-xs font-bold outline-none focus:ring-2 focus:ring-blue-500/20"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                >
                    <option value="">Todos los registros</option>
                    <option value="PENDIENTE">Por Validar (Pendientes)</option>
                    <option value="APROBADO">Aprobados</option>
                    <option value="RECHAZADO">Rechazados</option>
                </select>
                <div className="flex items-center justify-end px-2 text-[10px] font-black text-slate-400 uppercase tracking-tighter">
                    Mostrando {filteredPayments.length} transacciones
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center p-20"><Loader2 className="animate-spin text-[#1e3a8a]" size={40} /></div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredPayments.length > 0 ? (
                        filteredPayments.map((p) => (
                            <div 
                                key={p.id}
                                onClick={() => handleOpenDetail(p)}
                                className="bg-white rounded-[2.5rem] border border-slate-200 p-6 hover:shadow-2xl hover:border-blue-300 transition-all duration-300 cursor-pointer group relative overflow-hidden"
                            >
                                <div className="flex justify-between items-start mb-6">
                                    <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase border shadow-sm ${getStatusStyle(p.estado_validacion)}`}>
                                        {p.estado_validacion === 'PENDIENTE' ? '⚠️ ' + p.estado_validacion : p.estado_validacion}
                                    </div>
                                    <div className="p-2.5 bg-slate-50 rounded-2xl group-hover:bg-orange-500 group-hover:text-white transition-all duration-300 group-hover:rotate-12">
                                        <ChevronRight size={18} />
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 bg-blue-50 text-[#1e3a8a] rounded-2xl group-hover:bg-[#1e3a8a] group-hover:text-white transition-colors duration-300">
                                            <User size={22} />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Emisor</p>
                                            <h3 className="text-sm font-black text-slate-800 truncate uppercase tracking-tight">
                                                {p.cuentas_por_cobrar.alumnos.usuarios.nombres} {p.cuentas_por_cobrar.alumnos.usuarios.apellidos}
                                            </h3>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4">
                                        <div className="p-3 bg-orange-50 text-orange-600 rounded-2xl group-hover:bg-orange-500 group-hover:text-white transition-colors duration-300">
                                            <DollarSign size={22} />
                                        </div>
                                        <div>
                                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Monto de Pago</p>
                                            <h3 className="text-xl font-black text-slate-900 italic tracking-tighter">
                                                S/ {p.monto_pagado}
                                            </h3>
                                        </div>
                                    </div>

                                    <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
                                        <div className="flex items-center gap-2 text-slate-400">
                                            <Clock size={14} className="text-orange-500" />
                                            <span className="text-[10px] font-black uppercase tracking-tighter">
                                                {new Date(p.fecha_pago).toLocaleDateString('es-PE', { day: '2-digit', month: 'short' })}
                                            </span>
                                        </div>
                                        <div className="text-[9px] font-black text-[#1e3a8a] uppercase bg-blue-50 px-3 py-1.5 rounded-xl border border-blue-100">
                                            {p.metodos_pago.nombre}
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Decoración de fondo */}
                                <AlertCircle className="absolute -right-8 -bottom-8 text-slate-50 group-hover:text-blue-50/50 transition-colors duration-500" size={140} />
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full py-24 text-center bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200">
                            <div className="p-4 bg-white rounded-full w-fit mx-auto mb-4 shadow-sm text-slate-300">
                                <Search size={32} />
                            </div>
                            <h3 className="text-slate-800 font-black uppercase text-sm">Búsqueda sin resultados</h3>
                            <p className="text-slate-400 font-bold italic text-xs mt-1">Intenta ajustando los filtros de estado o el texto.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default AdminPaymentManager;