import React, { useState } from 'react';
import { X, Check, AlertTriangle } from 'lucide-react';
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-[#1e293b] border border-white/10 rounded-2xl w-full max-w-lg shadow-2xl p-6 relative animate-in zoom-in-95 duration-200">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white">
                    <X size={20} />
                </button>

                <h2 className="text-xl font-bold text-white mb-1">Evaluar Solicitud</h2>
                <p className="text-sm text-gray-400 mb-6">Alumno: <span className="text-orange-400">{solicitud?.alumnos?.nombres}</span></p>

                <form onSubmit={handleEvaluate} className="space-y-4">
                    {/* Botones de Estado */}
                    <div className="grid grid-cols-2 gap-4 bg-black/20 p-1 rounded-xl">
                        <button
                            type="button"
                            onClick={() => setEvalData({ ...evalData, estado: 'APROBADA' })}
                            className={`py-2 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2 ${evalData.estado === 'APROBADA' ? 'bg-green-500 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
                        >
                            <Check size={16} /> APROBAR
                        </button>
                        <button
                            type="button"
                            onClick={() => setEvalData({ ...evalData, estado: 'RECHAZADA' })}
                            className={`py-2 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2 ${evalData.estado === 'RECHAZADA' ? 'bg-red-500 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
                        >
                            <X size={16} /> RECHAZAR
                        </button>
                    </div>

                    {/* Formulario Dinámico si es Aprobada */}
                    {evalData.estado === 'APROBADA' && (
                        <div className="space-y-4 border-t border-white/10 pt-4 mt-4 animate-in fade-in slide-in-from-top-2">
                            <div>
                                <label className="block text-xs font-bold text-blue-300 uppercase mb-2">Duración</label>
                                <div className="flex gap-4">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input type="radio" name="tipo" checked={evalData.tipo === 'RANGO'} onChange={() => setEvalData({ ...evalData, tipo: 'RANGO' })} className="accent-orange-500" />
                                        <span className="text-sm text-white">Temporal (Rango)</span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input type="radio" name="tipo" checked={evalData.tipo === 'INDEFINIDO'} onChange={() => setEvalData({ ...evalData, tipo: 'INDEFINIDO' })} className="accent-orange-500" />
                                        <span className="text-sm text-white">Indefinida</span>
                                    </label>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 mb-1">Inicio</label>
                                    <input type="date" required className="w-full bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:border-orange-500 outline-none" value={evalData.fechaInicio} onChange={(e) => setEvalData({ ...evalData, fechaInicio: e.target.value })} />
                                </div>
                                {evalData.tipo === 'RANGO' && (
                                    <div>
                                        <label className="block text-xs font-bold text-gray-400 mb-1">Fin</label>
                                        <input type="date" required className="w-full bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:border-orange-500 outline-none" value={evalData.fechaFin} onChange={(e) => setEvalData({ ...evalData, fechaFin: e.target.value })} />
                                    </div>
                                )}
                            </div>

                            {evalData.tipo === 'INDEFINIDO' && (
                                <div className="text-xs text-yellow-400 bg-yellow-400/10 p-2 rounded border border-yellow-400/20 flex gap-2 items-start">
                                    <AlertTriangle size={14} className="mt-0.5 shrink-0" />
                                    <span>Se justificarán todas las clases futuras.</span>
                                </div>
                            )}
                        </div>
                    )}

                    <div>
                        <label className="block text-xs font-bold text-gray-400 mb-1">Notas</label>
                        <textarea rows="2" className="w-full bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:border-orange-500 outline-none" placeholder="Comentario..." value={evalData.notas} onChange={(e) => setEvalData({ ...evalData, notas: e.target.value })} />
                    </div>

                    <button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl shadow-lg mt-4 transition-all disabled:opacity-50">
                        {loading ? 'Procesando...' : 'CONFIRMAR DECISIÓN'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default InjuryEvaluationModal;