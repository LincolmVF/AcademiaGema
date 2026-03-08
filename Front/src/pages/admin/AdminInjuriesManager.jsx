import React, { useState, useEffect } from 'react';
import { Eye, X, Activity, RefreshCw, ClipboardCheck } from 'lucide-react';
import toast from 'react-hot-toast';
import lesionService from '../../services/lesion.service';
import InjuryEvaluationModal from '../../components/admin/Injuries/InjuryEvaluationModal';

const AdminInjuriesManager = () => {
    const [solicitudes, setSolicitudes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedSolicitud, setSelectedSolicitud] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [evidenceViewerOpen, setEvidenceViewerOpen] = useState(false);
    const [evidenceUrl, setEvidenceUrl] = useState('');

    const fetchPendientes = async () => {
        try {
            setLoading(true);
            const data = await lesionService.obtenerPendientes();
            setSolicitudes(data);
        } catch (error) {
            toast.error('Error al cargar solicitudes');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPendientes();
    }, []);

    const openEvaluateModal = (sol) => {
        setSelectedSolicitud(sol);
        setModalOpen(true);
    };

    const openEvidenceViewer = (url) => {
        setEvidenceUrl(url);
        setEvidenceViewerOpen(true);
    };

    return (
        <div className="p-6 md:p-10 max-w-7xl mx-auto min-h-screen bg-slate-50">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-[#1e3a8a] rounded-xl text-white shadow-lg shadow-blue-900/20">
                            <Activity size={24} />
                        </div>
                        <h1 className="text-3xl font-black text-[#1e3a8a] uppercase italic tracking-tighter">
                            Control de <span className="text-orange-500">Lesiones</span>
                        </h1>
                    </div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] italic ml-1">
                        Panel Administrativo • Club Gema Performance
                    </p>
                </div>

                <button
                    onClick={fetchPendientes}
                    className="flex items-center gap-2 bg-white px-5 py-2.5 rounded-2xl border border-slate-200 text-xs font-black uppercase tracking-widest text-[#1e3a8a] hover:bg-blue-50 transition-all shadow-sm active:scale-95"
                >
                    <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
                    Refrescar Datos
                </button>
            </div>

            {/* Tabla de Solicitudes */}
            <div className="bg-transparent md:bg-white md:rounded-[2.5rem] md:border md:border-slate-100 md:overflow-hidden md:shadow-[0_20px_50px_rgba(0,0,0,0.04)]">
                
                {/* VISTA DESKTOP: Tabla Tradicional */}
                <div className="hidden md:block overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-100">
                                <th className="px-8 py-6 text-left text-[10px] font-black uppercase tracking-widest text-slate-400">Alumno</th>
                                <th className="px-8 py-6 text-left text-[10px] font-black uppercase tracking-widest text-slate-400">Motivo / Descripción</th>
                                <th className="px-8 py-6 text-center text-[10px] font-black uppercase tracking-widest text-slate-400">Evidencia</th>
                                <th className="px-8 py-6 text-center text-[10px] font-black uppercase tracking-widest text-slate-400">Fecha Solicitud</th>
                                <th className="px-8 py-6 text-center text-[10px] font-black uppercase tracking-widest text-slate-400">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {solicitudes.map((sol) => (
                                <tr key={sol.id} className="hover:bg-blue-50/30 transition-colors group">
                                    <td className="px-8 py-5">
                                        <div className="font-black text-[#1e3a8a] uppercase italic">{sol.alumnos.usuarios.nombres} {sol.alumnos.usuarios.apellidos}</div>
                                        <div className="text-[10px] font-bold text-slate-400 tracking-wider uppercase">DNI: {sol.alumnos.usuarios.numero_documento}</div>
                                    </td>
                                    <td className="px-8 py-5 text-sm text-slate-600 font-medium max-w-xs truncate italic">
                                        "{sol.descripcion_lesion}"
                                    </td>
                                    <td className="px-8 py-5 text-center">
                                        <button
                                            onClick={() => openEvidenceViewer(sol.url_evidencia_medica)}
                                            className="inline-flex items-center justify-center w-11 h-11 rounded-2xl bg-blue-50 text-[#1e3a8a] hover:bg-[#1e3a8a] hover:text-white transition-all shadow-sm hover:shadow-md"
                                        >
                                            <Eye size={20} />
                                        </button>
                                    </td>
                                    <td className="px-8 py-5 text-center">
                                        <span className="text-[10px] font-black text-slate-500 bg-slate-100 px-3 py-1.5 rounded-xl uppercase tracking-tighter">
                                            {new Date(sol.fecha_solicitud).toLocaleDateString('es-PE', { day: '2-digit', month: 'short', year: 'numeric' })}
                                        </span>
                                    </td>
                                    <td className="px-8 py-5 text-center">
                                        <button
                                            onClick={() => openEvaluateModal(sol)}
                                            className="bg-orange-500 hover:bg-[#0f172a] text-white px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-orange-500/20 transition-all hover:-translate-y-0.5 active:scale-95"
                                        >
                                            Evaluar
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* VISTA MÓVIL: Cards elegantes */}
                <div className="md:hidden space-y-4">
                    {loading ? (
                        <div className="py-20 text-center bg-white rounded-[2rem] shadow-sm border border-slate-100">
                             <div className="inline-block w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                             <p className="mt-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Cargando solicitudes...</p>
                        </div>
                    ) : solicitudes.length === 0 ? (
                        <div className="py-20 text-center bg-white rounded-[2rem] shadow-sm border border-slate-100">
                            <ClipboardCheck size={48} className="mx-auto mb-4 text-slate-200" />
                            <p className="text-slate-500 font-bold italic text-sm px-10">No hay solicitudes pendientes de revisión.</p>
                        </div>
                    ) : (
                        solicitudes.map((sol) => (
                            <div key={sol.id} className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm relative overflow-hidden group active:scale-[0.98] transition-all">
                                <div className="absolute top-0 right-0 p-6 opacity-[0.03] text-[#1e3a8a] group-hover:scale-110 transition-transform">
                                    <Activity size={80} />
                                </div>
                                
                                <div className="flex items-center gap-4 mb-6 border-b border-slate-50 pb-4">
                                    <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-[#1e3a8a] font-black">
                                        {sol.alumnos.usuarios.nombres[0]}
                                    </div>
                                    <div>
                                        <h3 className="font-black text-[#1e3a8a] uppercase italic text-sm leading-tight">
                                            {sol.alumnos.usuarios.nombres} {sol.alumnos.usuarios.apellidos}
                                        </h3>
                                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">DNI: {sol.alumnos.usuarios.numero_documento}</p>
                                    </div>
                                </div>

                                <div className="space-y-4 mb-6">
                                    <div className="flex items-start gap-3">
                                        <FileText size={14} className="text-slate-300 mt-1 shrink-0" />
                                        <p className="text-xs text-slate-600 font-medium italic leading-relaxed">
                                            "{sol.descripcion_lesion}"
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Calendar size={14} className="text-slate-300 shrink-0" />
                                        <p className="text-[10px] font-black text-slate-500 uppercase">
                                            Solicitado: {new Date(sol.fecha_solicitud).toLocaleDateString('es-PE', { day: '2-digit', month: 'long' })}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex gap-3">
                                    <button
                                        onClick={() => openEvidenceViewer(sol.url_evidencia_medica)}
                                        className="flex-1 flex items-center justify-center gap-2 bg-blue-50 text-[#1e3a8a] py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest active:bg-blue-100 transition-colors"
                                    >
                                        <Eye size={16} /> Ver Evidencia
                                    </button>
                                    <button
                                        onClick={() => openEvaluateModal(sol)}
                                        className="flex-1 bg-orange-500 text-white py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-orange-500/20 active:bg-orange-600 transition-colors"
                                    >
                                        Evaluar
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Componente Modal Importado */}
            <InjuryEvaluationModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                solicitud={selectedSolicitud}
                onEvaluateSuccess={fetchPendientes}
            />

            {/* Visor de Evidencia Estilizado */}
            {evidenceViewerOpen && (
                <div
                    className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#0f172a]/95 backdrop-blur-md animate-in fade-in duration-300"
                    onClick={() => setEvidenceViewerOpen(false)}
                >
                    <div className="relative max-w-4xl max-h-[90vh] w-full flex justify-center items-center" onClick={(e) => e.stopPropagation()}>
                        <button
                            onClick={() => setEvidenceViewerOpen(false)}
                            className="absolute -top-14 right-0 p-2 text-white/50 hover:text-orange-500 transition-colors bg-white/5 rounded-full"
                        >
                            <X size={32} />
                        </button>
                        <div className="relative p-2 bg-white rounded-[2rem] shadow-2xl ring-4 ring-orange-500/20">
                            <img
                                src={evidenceUrl}
                                alt="Evidencia Médica"
                                className="max-w-full max-h-[80vh] object-contain rounded-2xl"
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminInjuriesManager;