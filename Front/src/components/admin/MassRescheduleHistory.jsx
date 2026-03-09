import React, { useState, useEffect } from 'react';
import { RefreshCcw, CalendarClock, ArrowLeftRight, Clock, Trash2, CalendarX2 } from 'lucide-react';
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
            toast.error('No se pudo cargar el historial de reprogramaciones masivas.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleRevert = async (grupo_uuid) => {
        if (!window.confirm('¿Estás seguro que deseas REVERTIR esta reprogramación masiva? Todos los alumnos volverán a su fecha original y esta acción se marcará como revertida.')) {
            return;
        }

        setIsRevertingUuid(grupo_uuid);
        try {
            const response = await apiFetch.post(API_ROUTES.CLASES.REVERTIR_MASIVO, { grupo_uuid });
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || 'Error revirtiendo la reprogramación.');
            }

            toast.success('Reprogramación masiva revertida exitosamente.');
            // Actualizamos la lista local para remover el item (o podríamos volver a fetchear)
            setHistory(prev => prev.filter(h => h.grupo_uuid !== grupo_uuid));
        } catch (error) {
            console.error('Error revertiendo:', error);
            toast.error(error.message || 'Error al tratar de revertir la reprogramación.');
        } finally {
            setIsRevertingUuid(null);
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center p-8">
                <RefreshCcw className="animate-spin text-slate-400" size={24} />
            </div>
        );
    }

    if (history.length === 0) {
        return (
            <div className="text-center p-8 bg-slate-50 border border-slate-200 rounded-xl">
                <CalendarX2 className="mx-auto text-slate-300 mb-3" size={40} />
                <h3 className="text-sm font-semibold text-slate-600">No hay reprogramaciones masivas activas</h3>
                <p className="text-xs text-slate-400 mt-1">Las reprogramaciones en lote aparecerán aquí permitiendo su reversión.</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-bold text-slate-700 flex items-center gap-2">
                    <Clock size={16} className="text-blue-600" />
                    Últimas Reprogramaciones Activas
                </h3>
                <button 
                    onClick={fetchHistory}
                    className="text-xs flex items-center gap-1 text-slate-500 hover:text-blue-600 transition-colors bg-white border border-slate-200 px-2 py-1 rounded-md shadow-sm"
                >
                    <RefreshCcw size={12} />
                    Actualizar
                </button>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {history.map((item) => {
                    const origen = new Date(item.fecha_origen).toLocaleDateString();
                    const destino = new Date(item.fecha_destino).toLocaleDateString();
                    const isReverting = isRevertingUuid === item.grupo_uuid;

                    return (
                        <div key={item.id} className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm relative overflow-hidden group hover:border-blue-200 hover:shadow-md transition-all">
                            
                            <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>
                            
                            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 pl-2">
                                
                                <div className="space-y-3 flex-1">
                                    <div className="flex flex-wrap items-center gap-2 text-xs">
                                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-md font-semibold font-mono">
                                            Lote: {item.grupo_uuid.split('-')[0]}
                                        </span>
                                        <span className="text-slate-500 bg-slate-100 px-2 py-1 rounded-md">
                                            Por: {item.usuarios?.nombres} {item.usuarios?.apellidos?.charAt(0)}.
                                        </span>
                                        <span className="text-amber-600 bg-amber-50 px-2 py-1 rounded-md font-medium">
                                            {item._count?.registros_asistencia} Asistencias Movidas
                                        </span>
                                    </div>

                                    <div className="flex items-center flex-wrap gap-2 md:gap-4 mt-2">
                                        <div className="flex items-center gap-2 text-sm text-slate-600 font-medium">
                                            <CalendarClock size={16} className="text-slate-400" />
                                            {origen}
                                        </div>
                                        <ArrowLeftRight size={14} className="text-slate-300 hidden md:block" />
                                        <div className="flex items-center gap-2 text-sm text-blue-700 font-bold bg-blue-50 px-2 py-1 rounded-lg">
                                            <CalendarClock size={16} className="text-blue-500" />
                                            {destino} ({item.hora_inicio_destino} - {item.hora_fin_destino})
                                        </div>
                                    </div>

                                    <div className="text-xs text-slate-500">
                                        <span className="font-semibold text-slate-600">Horario Origen:</span> {item.horarios_clases?.canchas?.nombre} ({item.horarios_clases?.niveles_entrenamiento?.nombre}) <br/>
                                        <span className="font-semibold text-slate-600">Motivo:</span> "{item.motivo}"
                                    </div>
                                </div>

                                <div className="flex-shrink-0 flex self-start md:self-center">
                                    <button
                                        onClick={() => handleRevert(item.grupo_uuid)}
                                        disabled={isReverting}
                                        className="flex items-center gap-2 text-red-600 bg-red-50 hover:bg-red-100 px-4 py-2 rounded-lg font-semibold text-sm transition-colors border border-red-100 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isReverting ? (
                                            <RefreshCcw size={16} className="animate-spin" />
                                        ) : (
                                            <Trash2 size={16} />
                                        )}
                                        Revertir Masivamente
                                    </button>
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
