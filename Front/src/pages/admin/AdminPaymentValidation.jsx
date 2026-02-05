import React, { useState, useEffect } from 'react';
import { ArrowLeft, CheckCircle, XCircle, Eye, Loader2, DollarSign, User, Calendar, Receipt, ExternalLink, Image as ImageIcon } from 'lucide-react';
import { apiFetch } from '../../interceptors/api';
import toast from 'react-hot-toast';

const AdminPaymentValidation = ({ onBack, paymentData, onSuccess }) => {
    const [loading, setLoading] = useState(false);
    const [validationStatus, setValidationStatus] = useState(paymentData?.estado_validacion || 'PENDIENTE');
    const [notas, setNotas] = useState(paymentData?.notas_validacion || '');

    // Formateador de moneda
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN' }).format(amount);
    };

    const handleVerify = async () => {
        if (validationStatus === 'PENDIENTE') {
            return toast.error("Por favor cambia el estado a APROBADO o RECHAZADO");
        }

        setLoading(true);
        try {
            const response = await apiFetch.put(`/pagos/${paymentData.id}/validar`, {
                estado: validationStatus,
                notas: notas
            });

            if (response.ok) {
                toast.success(`Pago ${validationStatus === 'APROBADO' ? 'aprobado' : 'rechazado'} con éxito`);
                if (onSuccess) onSuccess();
                onBack();
            } else {
                const error = await response.json();
                toast.error(error.message || "Error al actualizar el pago");
            }
        } catch (e) {
            toast.error("Error de conexión");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6 animate-fade-in-up p-1">
            {/* Header con estilo Gradiente idéntico */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center gap-4">
                    <button onClick={onBack} className="p-2.5 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 shadow-sm transition-all text-slate-600">
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <h1 className="text-2xl font-black italic uppercase tracking-tight">
                            Verificación de <span className="text-[#1e3a8a]">Pago</span>
                        </h1>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic">ID Transacción: #{paymentData?.codigo_operacion || paymentData?.id}</p>
                    </div>
                </div>
                <button
                    onClick={handleVerify}
                    disabled={loading || validationStatus === 'PENDIENTE'}
                    className="bg-gradient-to-r from-[#1e3a8a] to-[#0f172a] hover:from-orange-500 hover:to-orange-600 disabled:opacity-50 text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all duration-300 shadow-lg shadow-blue-900/20"
                >
                    {loading ? <Loader2 className="animate-spin" size={20} /> : <CheckCircle size={20} />}
                    Finalizar Verificación
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    {/* Detalles del Alumno y Pago */}
                    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                        <div className="p-6 border-b border-slate-100 bg-[#f8fafc] flex items-center gap-3">
                            <div className="p-2 bg-blue-100 text-[#1e3a8a] rounded-lg">
                                <User size={20} />
                            </div>
                            <h3 className="font-black text-[#1e3a8a] uppercase tracking-wider text-sm">Información del Emisor</h3>
                        </div>
                        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Alumno / Cliente</label>
                                <div className="text-sm font-bold text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-100">
                                    {paymentData?.cuentas_por_cobrar?.alumnos?.usuarios?.nombres} {paymentData?.cuentas_por_cobrar?.alumnos?.usuarios?.apellidos}
                                </div>
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Concepto de Pago</label>
                                <div className="text-sm font-bold text-[#1e3a8a] bg-blue-50 p-3 rounded-xl border border-blue-100">
                                    {paymentData?.cuentas_por_cobrar?.catalogo_conceptos?.nombre || 'Mensualidad'}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Comprobante Visual */}
                    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                        <div className="p-6 border-b border-slate-100 bg-[#f8fafc] flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-orange-100 text-orange-600 rounded-lg">
                                    <ImageIcon size={20} />
                                </div>
                                <h3 className="font-black text-[#1e3a8a] uppercase tracking-wider text-sm">Evidencia de Pago</h3>
                            </div>
                            {paymentData?.url_comprobante && (
                                <a
                                    href={paymentData.url_comprobante}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 text-[10px] font-black text-blue-600 uppercase hover:underline"
                                >
                                    Abrir en pestaña <ExternalLink size={12} />
                                </a>
                            )}
                        </div>
                        <div className="p-6 flex flex-col items-center">
                            {paymentData?.url_comprobante ? (
                                <div className="relative group overflow-hidden rounded-2xl border border-slate-200 shadow-inner bg-slate-50 max-w-md w-full">
                                    <img
                                        src={paymentData.url_comprobante}
                                        alt="Comprobante"
                                        className="w-full h-auto object-contain max-h-[400px] transition-transform duration-500 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <button className="bg-white text-black px-4 py-2 rounded-full text-xs font-black uppercase flex items-center gap-2">
                                            <Eye size={14} /> Ampliar Foto
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="py-20 text-center space-y-2">
                                    <XCircle size={40} className="mx-auto text-slate-300" />
                                    <p className="text-slate-400 font-bold italic">No se adjuntó imagen del comprobante</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Columna Derecha: Acción y Resumen */}
                <div className="space-y-6">
                    {/* Panel de Decisión */}
                    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
                        <div className="p-6 border-b border-slate-100 bg-[#f8fafc] flex items-center gap-3">
                            <div className="p-2 bg-blue-100 text-[#1e3a8a] rounded-lg">
                                <CheckCircle size={20} />
                            </div>
                            <h3 className="font-black text-[#1e3a8a] uppercase tracking-wider text-sm">Validación</h3>
                        </div>
                        <div className="p-6 space-y-5">
                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    onClick={() => setValidationStatus('APROBADO')}
                                    className={`p-4 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all ${validationStatus === 'APROBADO' ? 'border-green-500 bg-green-50 text-green-700' : 'border-slate-100 bg-slate-50 text-slate-400 hover:border-slate-200'}`}
                                >
                                    <CheckCircle size={24} />
                                    <span className="text-[10px] font-black uppercase">Aprobar</span>
                                </button>
                                <button
                                    onClick={() => setValidationStatus('RECHAZADO')}
                                    className={`p-4 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all ${validationStatus === 'RECHAZADO' ? 'border-red-500 bg-red-50 text-red-700' : 'border-slate-100 bg-slate-50 text-slate-400 hover:border-slate-200'}`}
                                >
                                    <XCircle size={24} />
                                    <span className="text-[10px] font-black uppercase">Rechazar</span>
                                </button>
                            </div>

                            <div className="space-y-1">
                                <label className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">Observaciones (Opcional)</label>
                                <textarea
                                    value={notas}
                                    onChange={(e) => setNotas(e.target.value)}
                                    placeholder="Motivo del rechazo o nota interna..."
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold outline-none focus:border-[#1e3a8a] min-h-[100px] resize-none"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Widget de Resumen Visual - Reutilizando el estilo de AdminSchedule */}
                    <div className="bg-gradient-to-br from-[#1e3a8a] to-[#0f172a] p-6 rounded-3xl text-white shadow-xl relative overflow-hidden group">
                        <div className="relative z-10">
                            <h4 className="font-black uppercase italic tracking-tighter text-xl mb-2 text-orange-500">Monto Final</h4>
                            <div className="space-y-2 opacity-80 text-[10px] font-bold uppercase">
                                <p className="flex justify-between border-b border-white/10 pb-1">Monto Pagado: <span className="text-white text-base">{formatCurrency(paymentData?.monto_pagado || 0)}</span></p>
                                <p className="flex justify-between border-b border-white/10 pb-1">Método: <span className="text-white">{paymentData?.metodos_pago?.nombre || 'Transferencia'}</span></p>
                                <p className="flex justify-between">Fecha Reporte: <span className="text-white">{paymentData?.fecha_pago ? new Date(paymentData.fecha_pago).toLocaleDateString() : '---'}</span></p>
                            </div>
                        </div>
                        <div className="absolute -right-4 -bottom-4 opacity-10 rotate-12 group-hover:scale-110 transition-transform duration-500">
                            <DollarSign size={120} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminPaymentValidation;