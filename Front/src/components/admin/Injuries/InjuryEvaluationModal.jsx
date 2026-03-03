import React, { useState } from 'react';
import { X, Check, AlertTriangle, User, ClipboardList } from 'lucide-react';
import toast from 'react-hot-toast';
import lesionService from '../../../services/lesion.service';

const InjuryEvaluationModal = ({ isOpen, onClose, solicitud, onEvaluateSuccess }) => {
    const [evalData, setEvalData] = useState({
        estado: 'APROBADA',
        tipo: 'RANGO',
        fechaInicio: new Date().toISOString().split('T')[0],
        fechaFin: '',
        notas: ''
    });
    const [loading, setLoading] = useState(false);

    if (!isOpen || !solicitud) return null;

    const handleEvaluate = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            await lesionService.evaluarSolicitud(solicitud.id, evalData);
            toast.success(`Solicitud ${evalData.estado === 'APROBADA' ? 'aprobada' : 'rechazada'} correctamente`);
            onEvaluateSuccess();
            onClose();
        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0f172a]/60 backdrop-blur-md animate-in fade-in duration-300">
            <div className="bg-white border border-slate-200 rounded-[2.5rem] w-full max-w-lg shadow-2xl p-8 relative animate-in zoom-in-95 duration-200">
                {/* Botón Cerrar */}
                <button onClick={onClose} className="absolute top-6 right-6 text-slate-400 hover:text-[#1e3a8a] transition-colors p-2 hover:bg-slate-50 rounded-full">
                    <X size={20} />
                </button>

                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-blue-50 text-[#1e3a8a] rounded-xl">
                            <ClipboardList size={20} />
                        </div>
                        <h2 className="text-xl font-black text-[#1e3a8a] uppercase italic tracking-tighter">Evaluar <span className="text-orange-500">Solicitud</span></h2>
                    </div>
                    <div className="flex items-center gap-2 bg-slate-50 p-3 rounded-2xl border border-slate-100 mt-4">
                        <div className="w-8 h-8 rounded-full bg-[#1e3a8a] flex items-center justify-center text-white font-bold text-xs uppercase">
                            {solicitud?.alumnos?.usuarios?.nombres?.charAt(0) || 'A'}
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Alumno en revisión</p>
                            <p className="text-sm font-bold text-slate-700 leading-none">{solicitud?.alumnos?.usuarios?.nombres} {solicitud?.alumnos?.usuarios?.apellidos}</p>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleEvaluate} className="space-y-6">
                    {/* Selector de Estado (Aprobar/Rechazar) */}
                    <div className="grid grid-cols-2 gap-3 bg-slate-100 p-1.5 rounded-[1.5rem]">
                        <button
                            type="button"
                            onClick={() => setEvalData({ ...evalData, estado: 'APROBADA' })}
                            className={`py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${evalData.estado === 'APROBADA' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                        >
                            <Check size={14} strokeWidth={3} /> APROBAR
                        </button>
                        <button
                            type="button"
                            onClick={() => setEvalData({ ...evalData, estado: 'RECHAZADA' })}
                            className={`py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${evalData.estado === 'RECHAZADA' ? 'bg-white text-red-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                        >
                            <X size={14} strokeWidth={3} /> RECHAZAR
                        </button>
                    </div>

                    {/* Formulario Dinámico si es Aprobada */}
                    {evalData.estado === 'APROBADA' && (
                        <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                            <div className="bg-blue-50/50 p-4 rounded-2xl border border-blue-100">
                                <label className="block text-[10px] font-black text-[#1e3a8a] uppercase tracking-widest mb-3">Duración de la baja</label>
                                <div className="flex gap-6">
                                    <label className="flex items-center gap-2 cursor-pointer group">
                                        <input type="radio" name="tipo" checked={evalData.tipo === 'RANGO'} onChange={() => setEvalData({ ...evalData, tipo: 'RANGO' })} className="w-4 h-4 accent-orange-500" />
                                        <span className="text-xs font-bold text-slate-600 group-hover:text-[#1e3a8a]">Temporal</span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer group">
                                        <input type="radio" name="tipo" checked={evalData.tipo === 'INDEFINIDO'} onChange={() => setEvalData({ ...evalData, tipo: 'INDEFINIDO' })} className="w-4 h-4 accent-orange-500" />
                                        <span className="text-xs font-bold text-slate-600 group-hover:text-[#1e3a8a]">Indefinida</span>
                                    </label>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Inicio</label>
                                    <input type="date" required className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-700 text-sm focus:border-orange-500 focus:ring-4 focus:ring-orange-500/5 outline-none transition-all font-medium" value={evalData.fechaInicio} onChange={(e) => setEvalData({ ...evalData, fechaInicio: e.target.value })} />
                                </div>
                                {evalData.tipo === 'RANGO' && (
                                    <div className="space-y-1">
                                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Fin Estimado</label>
                                        <input type="date" required className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-700 text-sm focus:border-orange-500 focus:ring-4 focus:ring-orange-500/5 outline-none transition-all font-medium" value={evalData.fechaFin} onChange={(e) => setEvalData({ ...evalData, fechaFin: e.target.value })} />
                                    </div>
                                )}
                            </div>

                            {evalData.tipo === 'INDEFINIDO' && (
                                <div className="text-[10px] font-bold text-amber-700 bg-amber-50 p-3 rounded-xl border border-amber-100 flex gap-2 items-center uppercase tracking-tight">
                                    <AlertTriangle size={14} className="shrink-0" />
                                    <span>Se justificarán todas las sesiones automáticamente.</span>
                                </div>
                            )}
                        </div>
                    )}

                    <div className="space-y-1">
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Observaciones</label>
                        <textarea rows="2" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-700 text-sm focus:border-orange-500 focus:ring-4 focus:ring-orange-500/5 outline-none transition-all font-medium resize-none" placeholder="Escribe el motivo del dictamen..." value={evalData.notas} onChange={(e) => setEvalData({ ...evalData, notas: e.target.value })} />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[#1e3a8a] hover:bg-[#162a63] text-white font-black uppercase tracking-[0.2em] py-4 rounded-2xl shadow-xl shadow-blue-900/20 mt-4 transition-all disabled:opacity-50 active:scale-95 text-[11px]"
                    >
                        {loading ? 'Sincronizando...' : 'Confirmar Dictamen'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default InjuryEvaluationModal;