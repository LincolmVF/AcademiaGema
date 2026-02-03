import React, { useState } from 'react';
import { Save, Trophy, BarChart, Banknote, ArrowLeft } from 'lucide-react';

const AdminLevels = ({ onBack }) => {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        nombre: '',
        precio_referencial: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async () => {
        setLoading(true);
        const payload = {
            nombre: formData.nombre,
            precio_referencial: parseFloat(formData.precio_referencial)
        };

        console.log("Payload para Prisma (niveles_entrenamiento):", payload);

        setTimeout(() => {
            setLoading(false);
            onBack();
        }, 1000);
    };

    return (
        <div className="space-y-6 animate-fade-in-up p-1">
            {/* Header Formulario */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center gap-3">
                    <button
                        onClick={onBack}
                        className="group flex items-center justify-center w-10 h-10 bg-white border border-slate-200 rounded-xl hover:border-orange-500 hover:text-orange-500 transition-all duration-300 shadow-sm"
                    >
                        <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                    </button>

                    <div className="flex flex-col">
                        <div className="flex items-center gap-2 mb-0.5">
                            <div className="h-5 w-1 bg-orange-500 rounded-full"></div>
                            <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tight">
                                Registro de <span className="text-[#1e3a8a]">Nivel</span>
                            </h1>
                        </div>
                        <p className="text-slate-500 text-[11px] font-bold uppercase tracking-wide ml-3">
                            Configuración <span className="text-orange-500">Académica</span>
                        </p>
                    </div>
                </div>

                <button
                    onClick={handleSubmit}
                    disabled={loading || !formData.nombre}
                    className="bg-gradient-to-r from-[#1e3a8a] to-[#0f172a] hover:from-orange-500 hover:to-orange-600 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-blue-900/20 disabled:opacity-50"
                >
                    <Save size={20} />
                    {loading ? 'GUARDANDO...' : 'GUARDAR NIVEL'}
                </button>
            </div>

            <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-slate-100 bg-[#f8fafc] flex items-center gap-3">
                        <div className="p-2 bg-blue-100 text-[#1e3a8a] rounded-lg">
                            <BarChart size={20} />
                        </div>
                        <h3 className="font-black text-[#1e3a8a] uppercase text-xs tracking-wider">Detalles del Nivel</h3>
                    </div>

                    <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Nombre del Nivel</label>
                            <div className="relative">
                                <Trophy size={16} className="absolute left-4 top-3.5 text-orange-500" />
                                <input
                                    name="nombre"
                                    placeholder="Ej: BÁSICO MENORES"
                                    onChange={handleChange}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-12 pr-4 py-3 text-sm font-bold outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Precio Referencial (S/.)</label>
                            <div className="relative">
                                <Banknote size={16} className="absolute left-4 top-3.5 text-green-600" />
                                <input
                                    name="precio_referencial"
                                    type="number"
                                    placeholder="0.00"
                                    onChange={handleChange}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-12 pr-4 py-3 text-sm font-black text-slate-700 outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-6 bg-blue-500/5 border border-blue-100 p-4 rounded-2xl flex items-center gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                    <p className="text-[#1e3a8a] text-[10px] font-black uppercase tracking-widest">
                        Este precio servirá como base para sugerir el monto en las inscripciones de este nivel.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AdminLevels;