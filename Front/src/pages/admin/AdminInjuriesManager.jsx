import React, { useState, useEffect } from 'react';
import { Eye } from 'lucide-react';
import toast from 'react-hot-toast';
import lesionService from '../../services/lesion.service';
// Importamos el Modal
import InjuryEvaluationModal from '../../components/admin/Injuries/InjuryEvaluationModal';

const AdminInjuriesManager = () => {
    const [solicitudes, setSolicitudes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedSolicitud, setSelectedSolicitud] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);

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

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-4xl font-black text-[#1e3a8a] italic uppercase tracking-tighter">
                        Control de <span className="text-orange-500">Lesiones</span>
                    </h1>
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
                                            <a href={sol.url_evidencia_medica} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-500/30 text-blue-300 hover:bg-blue-400 hover:text-blue-700"><Eye size={16} /></a>
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
        </div>
    );
};

export default AdminInjuriesManager;