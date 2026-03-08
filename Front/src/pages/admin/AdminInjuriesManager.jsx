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
            <div className="bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.04)]">
                <div className="overflow-x-auto">
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
                            {loading ? (
                                <tr>
                                    <td colSpan="5" className="px-8 py-20 text-center">
                                        <div className="inline-block w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                                        <p className="mt-4 text-xs font-bold uppercase tracking-widest text-slate-400">Sincronizando solicitudes...</p>
                                    </td>
                                </tr>
                            ) : solicitudes.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-8 py-20 text-center">
                                        <ClipboardCheck size={48} className="mx-auto mb-4 text-slate-200" />
                                        <p className="text-slate-500 font-bold italic">No hay solicitudes de lesión pendientes de revisión.</p>
                                    </td>
                                </tr>
                            ) : (
                                solicitudes.map((sol) => (
                                    <tr key={sol.id} className="hover:bg-blue-50/30 transition-colors group">
                                        <td className="px-8 py-5">
                                            <div className="font-black text-[#1e3a8a] uppercase italic">{sol.alumnos.usuarios.nombres} {sol.alumnos.usuarios.apellidos}</div>
                                            <div className="text-[10px] font-bold text-slate-400 tracking-wider">DNI: {sol.alumnos.usuarios.numero_documento}</div>
                                        </td>
                                        <td className="px-8 py-5 text-sm text-slate-600 font-medium max-w-xs truncate">
                                            {sol.descripcion_lesion}
                                        </td>
                                        <td className="px-8 py-5 text-center">
                                            <button
                                                onClick={() => openEvidenceViewer(sol.url_evidencia_medica)}
                                                className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-blue-50 text-[#1e3a8a] hover:bg-[#1e3a8a] hover:text-white transition-all shadow-sm"
                                                title="Ver Evidencia"
                                            >
                                                <Eye size={18} />
                                            </button>
                                        </td>
                                        <td className="px-8 py-5 text-center">
                                            <span className="text-[11px] font-black text-slate-500 bg-slate-100 px-3 py-1.5 rounded-lg uppercase tracking-tighter">
                                                {new Date(sol.fecha_solicitud).toLocaleDateString('es-PE', { day: '2-digit', month: 'short', year: 'numeric' })}
                                            </span>
                                        </td>
                                        <td className="px-8 py-5 text-center">
                                            <button
                                                onClick={() => openEvaluateModal(sol)}
                                                className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-orange-500/20 transition-all hover:-translate-y-0.5 active:scale-95"
                                            >
                                                Evaluar
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
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