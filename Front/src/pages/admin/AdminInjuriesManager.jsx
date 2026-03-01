import React, { useState, useEffect } from 'react';
import { Eye, X } from 'lucide-react';
import toast from 'react-hot-toast';
import lesionService from '../../services/lesion.service';
// Importamos el Modal
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
        <div className="p-8">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <div className="h-6 w-1 bg-orange-500 rounded-full"></div>
                        <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tight italic">
                            Control de <span className="text-[#1e3a8a]">Lesiones</span>
                        </h1>
                    </div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic ml-1">Monitoreo de lesiones - Club Gema</p>
                </div>
                <button onClick={fetchPendientes} className="text-sm text-slate-400 hover:text-slate-600">Refrescar</button>
            </div>

            <div className="bg-white p-3 rounded-2xl border border-slate-200 overflow-hidden shadow-2xl">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-slate-50 text-slate-600 text-xs uppercase font-bold tracking-wider">
                            <tr>
                                <th className="px-6 py-4 text-left">Alumno</th>
                                <th className="px-6 py-4 text-left">Motivo</th>
                                <th className="px-6 py-4 text-center">Evidencia</th>
                                <th className="px-6 py-4 text-center">Fecha</th>
                                <th className="px-6 py-4 text-center">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {loading ? (
                                <tr><td colSpan="5" className="px-6 py-8 text-center text-gray-400">Cargando...</td></tr>
                            ) : solicitudes.length === 0 ? (
                                <tr><td colSpan="5" className="px-6 py-8 text-center text-gray-400">Sin pendientes.</td></tr>
                            ) : (
                                solicitudes.map((sol) => (
                                    <tr key={sol.id} className="hover:bg-white/5 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="font-bold text-gray-300">{sol.alumnos.usuarios.nombres} {sol.alumnos.usuarios.apellidos}</div>
                                            <div className="text-xs text-gray-300">{sol.alumnos.usuarios.numero_documento}</div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-300">{sol.descripcion_lesion}</td>
                                        <td className="px-6 py-4 text-center">
                                            <button
                                                onClick={() => openEvidenceViewer(sol.url_evidencia_medica)}
                                                className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-500/30 text-blue-300 hover:bg-blue-400 hover:text-blue-700 transition-colors"
                                                title="Ver Evidencia"
                                            >
                                                <Eye size={16} />
                                            </button>
                                        </td>
                                        <td className="px-6 py-4 text-center text-sm text-gray-300">{new Date(sol.fecha_solicitud).toLocaleDateString()}</td>
                                        <td className="px-6 py-4 flex justify-center">
                                            <button onClick={() => openEvaluateModal(sol)} className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-xs font-bold shadow-lg">EVALUAR</button>
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

            {evidenceViewerOpen && (
                <div
                    className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in"
                    onClick={() => setEvidenceViewerOpen(false)} // Cierra al hacer clic fuera
                >
                    <div className="relative max-w-4xl max-h-[90vh] w-full flex justify-center items-center" onClick={(e) => e.stopPropagation()}>
                        <button
                            onClick={() => setEvidenceViewerOpen(false)}
                            className="absolute -top-12 right-0 md:-right-12 text-white/70 hover:text-white transition-colors"
                        >
                            <X size={36} />
                        </button>
                        <img
                            src={evidenceUrl}
                            alt="Evidencia Médica"
                            className="max-w-full max-h-[85vh] object-contain rounded-xl shadow-2xl ring-1 ring-white/20"
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminInjuriesManager;