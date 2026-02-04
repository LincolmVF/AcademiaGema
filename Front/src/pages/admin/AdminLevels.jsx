import React, { useState } from 'react';
import { Save, Trophy, BarChart, Banknote, ArrowLeft, Loader2 } from 'lucide-react';
import { apiFetch } from '../../interceptors/api';
import toast from 'react-hot-toast';

const AdminLevels = ({ onBack, initialData }) => {
    const [loading, setLoading] = useState(false);
    const isEdit = !!initialData;

    const [formData, setFormData] = useState({
        nombre: initialData?.nombre || '',
        precio_referencial: initialData?.precio_referencial || ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.nombre.trim()) return toast.error("El nombre es obligatorio");

        setLoading(true);
        const payload = {
            nombre: formData.nombre.trim().toUpperCase(),
            precio_referencial: parseFloat(formData.precio_referencial) || 0
        };

        try {
            const url = isEdit ? `/niveles/${initialData.id}` : '/niveles';
            const response = await apiFetch(url, {
                method: isEdit ? 'PUT' : 'POST',
                body: JSON.stringify(payload)
            });
            const result = await response.json();

            if (response.ok) {
                toast.success(isEdit ? "¡Nivel actualizado!" : "¡Nivel creado exitosamente!");
                onBack();
            } else {
                toast.error(result.message || "Error en la operación");
            }
        } catch (error) {
            toast.error("Error crítico de conexión");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6 animate-fade-in-up p-1">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center gap-3">
                    <button onClick={onBack} className="w-10 h-10 bg-white border border-slate-200 rounded-xl flex items-center justify-center hover:text-orange-500 transition-all shadow-sm">
                        <ArrowLeft size={20} />
                    </button>
                    <h1 className="text-2xl font-black text-slate-900 uppercase">
                        {isEdit ? 'Modificar' : 'Nuevo'} <span className="text-[#1e3a8a]">Nivel</span>
                    </h1>
                </div>

                <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="bg-[#0f172a] text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg disabled:opacity-50"
                >
                    {loading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                    {isEdit ? 'ACTUALIZAR' : 'REGISTRAR'}
                </button>
            </div>

            <div className="max-w-3xl mx-auto bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
                <div className="p-6 border-b border-slate-100 bg-[#f8fafc] flex items-center gap-3">
                    <Trophy className="text-[#1e3a8a]" size={20} />
                    <span className="font-black text-slate-800 text-xs uppercase">Datos Académicos</span>
                </div>
                <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1">
                        <label className="text-[10px] font-black text-slate-400 uppercase">Nombre</label>
                        <input
                            value={formData.nombre}
                            onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold outline-none focus:ring-2 focus:ring-blue-500/20"
                            placeholder="Ej: ALTA COMPETENCIA"
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-[10px] font-black text-slate-400 uppercase">Precio Base (S/)</label>
                        <input
                            type="number"
                            value={formData.precio_referencial}
                            onChange={(e) => setFormData({ ...formData, precio_referencial: e.target.value })}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold outline-none focus:ring-2 focus:ring-blue-500/20"
                            placeholder="0.00"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminLevels;