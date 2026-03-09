import React, { useState, useEffect } from 'react';
import { 
    RefreshCcw, 
    CalendarClock, 
    ArrowRight, 
    RotateCcw, 
    CalendarX2,
    User,
    Users,
    MapPin,
    AlertCircle,
    CheckCircle2
} from 'lucide-react';
import apiFetch from '../../interceptors/api';
import { API_ROUTES } from '../../constants/apiRoutes';
import toast from 'react-hot-toast';

const MassRescheduleHistory = () => {
    const [history, setHistory] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isRevertingUuid, setIsRevertingUuid] = useState(null);

    useEffect(() => {
        fetchHistory();
    }, []);

    const fetchHistory = async () => {
        setIsLoading(true);
        try {
            const response = await apiFetch.get(API_ROUTES.CLASES.ACTIVAS_MASIVAS);
            const json = await response.json();
            setHistory(json.data || json || []);
        } catch (error) {
            console.error('Error fetching mass reschedules history:', error);
            toast.error('No se pudo cargar el historial.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleRevert = async (grupo_uuid) => {
        if (!window.confirm('¿ESTÁS SEGURO? Esta acción revertirá todos los cambios de este lote. Los alumnos volverán a sus horarios originales.')) {
            return;
        }

        setIsRevertingUuid(grupo_uuid);
        try {
            const response = await apiFetch.post(API_ROUTES.CLASES.REVERTIR_MASIVO, { grupo_uuid });
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || 'Error al revertir.');
            }

            toast.success('Cambios revertidos correctamente.');
            setHistory(prev => prev.filter(h => h.grupo_uuid !== grupo_uuid));
        } catch (error) {
            console.error('Error reverting:', error);
            toast.error(error.message || 'Error al tratar de revertir.');
        } finally {
            setIsRevertingUuid(null);
        }
    };

    if (isLoading) {
        return (
            <div className="flex flex-col justify-center items-center p-20 space-y-4">
                <div className="relative">
                    <div className="w-12 h-12 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin"></div>
                    <RefreshCcw className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-blue-600/50 animate-pulse" size={20} />
                </div>
                <p className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] animate-pulse">Consultando Historial...</p>
            </div>
        );
    }

    if (history.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center p-12 bg-slate-50/50 rounded-[2.5rem] border-2 border-dashed border-slate-200 group hover:border-blue-200 transition-colors">
                <div className="p-5 bg-white rounded-3xl shadow-xl shadow-slate-200 group-hover:scale-110 transition-transform mb-6">
                    <CalendarX2 className="text-slate-300 group-hover:text-blue-400 transition-colors" size={48} />
                </div>
                <h3 className="text-lg font-black text-slate-700 uppercase tracking-tight">Sin actividad pendiente</h3>
                <p className="text-sm text-slate-400 font-medium text-center max-w-[250px] mt-2 italic">
                    Aquí aparecerán las reprogramaciones que aún puedes deshacer.
                </p>
                <button 
                    onClick={fetchHistory}
                    className="mt-8 flex items-center gap-2 px-6 py-2.5 bg-white border border-slate-200 rounded-full text-xs font-bold text-slate-500 hover:text-blue-600 hover:border-blue-200 shadow-sm transition-all active:scale-95"
                >
                    <RefreshCcw size={14} />
                    Refrescar ahora
                </button>
            </div>
        );
    }

    return (
        <div className="relative pl-4">
            {/* Timeline Line */}
            <div className="absolute left-[23px] top-4 bottom-4 w-0.5 bg-gradient-to-b from-blue-200 via-slate-100 to-transparent"></div>

            <div className="space-y-6">
                {history.map((item) => {
                    const origen = new Date(item.fecha_origen).toLocaleDateString();
                    const destino = new Date(item.fecha_destino).toLocaleDateString();
                    const isReverting = isRevertingUuid === item.grupo_uuid;

                    return (
                        <div key={item.id} className="relative group pl-10">
                            {/* Dot */}
                            <div className="absolute left-[12px] top-6 w-5 h-5 bg-white border-4 border-blue-500 rounded-full z-10 shadow-sm group-hover:scale-125 transition-transform"></div>
                            
                            <div className="bg-white rounded-3xl border border-slate-100 shadow-lg shadow-slate-200/40 p-5 group-hover:border-blue-200 group-hover:shadow-xl transition-all duration-300">
                                <div className="flex flex-col gap-4">
                                    {/* Header info */}
                                    <div className="flex items-start justify-between">
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className="text-[10px] font-black bg-blue-600 text-white px-2 py-0.5 rounded-full uppercase tracking-widest shadow-sm">
                                                    Lote {item.grupo_uuid.split('-')[0]}
                                                </span>
                                                <div className="flex items-center gap-1 text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-100/50">
                                                    <Users size={12} />
                                                    {item._count?.registros_asistencia} Alumnos
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                                                <User size={14} />
                                                <span className="uppercase tracking-wider">{item.usuarios?.nombres} {item.usuarios?.apellidos}</span>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => handleRevert(item.grupo_uuid)}
                                            disabled={isReverting}
                                            className="flex items-center justify-center p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all border border-transparent hover:border-red-100 disabled:opacity-30 group/btn"
                                            title="Revertir cambio"
                                        >
                                            {isReverting ? (
                                                <RefreshCcw size={18} className="animate-spin" />
                                            ) : (
                                                <RotateCcw size={18} className="group-hover/btn:-rotate-45 transition-transform" />
                                            )}
                                        </button>
                                    </div>

                                    {/* Path Info */}
                                    <div className="flex flex-col sm:flex-row items-center gap-3 bg-slate-50/80 p-3 rounded-2xl border border-slate-100/50">
                                        <div className="flex flex-col items-center flex-1">
                                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Original</span>
                                            <div className="flex items-center gap-1.5 text-slate-600 font-bold text-xs uppercase">
                                                <CalendarClock size={14} className="text-slate-400" />
                                                {origen}
                                            </div>
                                        </div>
                                        <div className="flex-shrink-0 bg-white p-1.5 rounded-full shadow-sm border border-slate-100 rotate-90 sm:rotate-0">
                                            <ArrowRight size={14} className="text-blue-500" />
                                        </div>
                                        <div className="flex flex-col items-center flex-1">
                                            <span className="text-[9px] font-black text-blue-500 uppercase tracking-widest mb-1">Nuevo</span>
                                            <div className="flex flex-col items-center">
                                                <div className="flex items-center gap-1.5 text-blue-700 font-black text-xs uppercase">
                                                    <CheckCircle2 size={14} className="text-blue-500" />
                                                    {destino}
                                                </div>
                                                <span className="text-[10px] font-bold text-blue-400/80 mt-0.5">{item.hora_inicio_destino} - {item.hora_fin_destino}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Footer details */}
                                    <div className="pt-2 flex flex-col gap-2 border-t border-slate-50">
                                        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[10px] font-bold text-slate-500">
                                            <MapPin size={12} className="text-slate-300" />
                                            <span className="text-slate-600 font-black whitespace-nowrap">{item.horarios_clases?.canchas?.nombre}</span>
                                            <span className="opacity-40 hidden sm:inline">|</span>
                                            <span className="bg-slate-100 px-1.5 rounded uppercase tracking-tighter whitespace-nowrap">{item.horarios_clases?.niveles_entrenamiento?.nombre}</span>
                                        </div>
                                        <div className="flex gap-2">
                                            <AlertCircle size={12} className="text-slate-300 flex-shrink-0 mt-0.5" />
                                            <p className="text-[10px] text-slate-500 italic leading-snug font-medium line-clamp-2">
                                                "{item.motivo}"
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default MassRescheduleHistory;
