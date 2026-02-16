import React, { useState } from 'react';
import { Upload, Activity } from 'lucide-react';
import toast from 'react-hot-toast';
import lesionService from '../../../services/lesion.service';

const InjuryRequestForm = ({ onSuccess }) => {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({ descripcion: '', urlEvidencia: '' });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            await lesionService.crearSolicitud(formData);
            toast.success('Solicitud enviada correctamente');
            setFormData({ descripcion: '', urlEvidencia: '' });
            if (onSuccess) onSuccess(); // Callback para avisar al padre que cambie de tab
        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-gradient-to-br from-[#1e3a8a] to-[#142857] backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-xl">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <Activity className="text-orange-500" /> Detalle de la Lesión
            </h3>
            <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                    <label className="block text-xs font-bold text-blue-200 uppercase mb-2">Descripción del problema</label>
                    <textarea
                        required
                        rows="4"
                        className="w-full bg-black/20 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-orange-500 transition-colors"
                        placeholder="Explica brevemente qué te pasó..."
                        value={formData.descripcion}
                        onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                    />
                </div>

                <div>
                    <label className="block text-xs font-bold text-blue-200 uppercase mb-2">Evidencia Médica (URL)</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Upload size={16} className="text-gray-500" />
                        </div>
                        <input
                            type="url"
                            required
                            className="w-full bg-black/20 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white focus:outline-none focus:border-orange-500 transition-colors"
                            placeholder="https://drive.google.com/..."
                            value={formData.urlEvidencia}
                            onChange={(e) => setFormData({ ...formData, urlEvidencia: e.target.value })}
                        />
                    </div>
                    <p className="text-[10px] text-gray-400 mt-2 ml-1">
                        * Sube tu certificado a la nube y pega el enlace aquí.
                    </p>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white font-black py-4 rounded-xl shadow-lg shadow-orange-900/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? 'Enviando...' : 'ENVIAR SOLICITUD'}
                </button>
            </form>
        </div>
    );
};

export default InjuryRequestForm;