import React, { useState } from 'react';
import { Save, Tag, DollarSign, Hash, CalendarDays, ArrowLeft, Package } from 'lucide-react';

const AdminCatalog = ({ onBack }) => {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        nombre: '',
        codigo_interno: '',
        precio_base: '',
        cantidad_clases_semanal: '',
        es_vigente: true
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async () => {
        setLoading(true);
        const payload = {
            nombre: formData.nombre,
            codigo_interno: formData.codigo_interno || null,
            precio_base: parseFloat(formData.precio_base),
            cantidad_clases_semanal: parseInt(formData.cantidad_clases_semanal) || null,
            es_vigente: formData.es_vigente
        };

        console.log("Payload para Prisma (catalogo_conceptos):", payload);

        setTimeout(() => {
            setLoading(false);
            onBack();
        }, 1500);
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
                                Nuevo <span className="text-[#1e3a8a]">Concepto</span>
                            </h1>
                        </div>
                        <p className="text-slate-500 text-[11px] font-bold uppercase tracking-wide ml-3">
                            Catálogo de <span className="text-orange-500">Servicios y Precios</span>
                        </p>
                    </div>
                </div>

                <button
                    onClick={handleSubmit}
                    disabled={loading || !formData.nombre || !formData.precio_base}
                    className="bg-gradient-to-r from-[#1e3a8a] to-[#0f172a] hover:from-orange-500 hover:to-orange-600 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-blue-900/20 disabled:opacity-50"
                >
                    <Save size={20} />
                    {loading ? 'REGISTRANDO...' : 'GUARDAR CONCEPTO'}
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                        <div className="p-6 border-b border-slate-100 bg-[#f8fafc] flex items-center gap-3">
                            <div className="p-2 bg-blue-100 text-[#1e3a8a] rounded-lg">
                                <Tag size={20} />
                            </div>
                            <h3 className="font-black text-[#1e3a8a] uppercase text-xs tracking-wider">Detalles Económicos</h3>
                        </div>

                        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="md:col-span-2 space-y-1">
                                <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Nombre del Servicio/Producto</label>
                                <input name="nombre" placeholder="Ej: MENSUALIDAD FULL - 3 VECES POR SEMANA" onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold outline-none focus:ring-2 focus:ring-blue-500" />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Código Interno (Opcional)</label>
                                <div className="relative">
                                    <Hash size={14} className="absolute left-4 top-3 text-slate-400" />
                                    <input name="codigo_interno" placeholder="MAT-2026" onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm font-bold outline-none focus:ring-2 focus:ring-blue-500" />
                                </div>
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Precio Base (S/.)</label>
                                <div className="relative">
                                    <DollarSign size={14} className="absolute left-4 top-3 text-green-600" />
                                    <input name="precio_base" type="number" placeholder="0.00" onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm font-black text-slate-700 outline-none focus:ring-2 focus:ring-blue-500" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                        <div className="p-6 border-b border-slate-100 bg-[#f8fafc] flex items-center gap-3">
                            <div className="p-2 bg-orange-100 text-orange-600 rounded-lg">
                                <CalendarDays size={20} />
                            </div>
                            <h3 className="font-black text-[#1e3a8a] uppercase text-xs tracking-wider">Lógica Académica</h3>
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-slate-400 uppercase">Clases por Semana</label>
                                <input name="cantidad_clases_semanal" type="number" placeholder="Ej: 3" onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold outline-none focus:border-[#1e3a8a]" />
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-100">
                                <input type="checkbox" name="es_vigente" checked={formData.es_vigente} onChange={handleChange} className="w-5 h-5 rounded-md border-slate-300 text-[#1e3a8a] focus:ring-[#1e3a8a]" />
                                <label className="text-[10px] font-black text-[#1e3a8a] uppercase">Concepto Vigente</label>
                            </div>
                        </div>
                    </div>

                    <div className="bg-[#0f172a] p-6 rounded-3xl text-white shadow-xl relative overflow-hidden">
                        <div className="relative z-10">
                            <Package size={32} className="text-orange-500 mb-3" />
                            <h4 className="font-black uppercase italic tracking-tighter text-lg leading-tight">Módulo Financiero</h4>
                            <p className="text-[10px] opacity-70 font-bold uppercase mt-2 leading-relaxed">
                                Estos conceptos aparecerán al momento de generar deudas a los alumnos.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminCatalog;