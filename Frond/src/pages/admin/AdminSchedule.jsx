import React, { useState } from 'react';
import { Save, Clock, User, Trophy, MapPin, ArrowLeft, CheckCircle2 } from 'lucide-react';

const AdminSchedule = ({ onBack }) => {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        cancha_id: '',
        profesor_id: '',
        nivel_id: '',
        dias_seleccionados: [], // Array para múltiples días
        hora_inicio: '',
        hora_fin: '',
        capacidad_max: 20
    });

    const diasSemana = [
        { id: 1, label: 'Lun' }, { id: 2, label: 'Mar' }, { id: 3, label: 'Mie' },
        { id: 4, label: 'Jue' }, { id: 5, label: 'Vie' }, { id: 6, label: 'Sab' }, { id: 0, label: 'Dom' }
    ];

    const toggleDia = (id) => {
        setFormData(prev => ({
            ...prev,
            dias_seleccionados: prev.dias_seleccionados.includes(id)
                ? prev.dias_seleccionados.filter(d => d !== id)
                : [...prev.dias_seleccionados, id]
        }));
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async () => {
        if (formData.dias_seleccionados.length === 0) return alert("Selecciona al menos un día");
        setLoading(true);

        // Simulación de envío: En Prisma harías un createMany o varios create
        console.log("Payload para Prisma:", formData);

        setTimeout(() => {
            setLoading(false);
            onBack();
        }, 1500);
    };

    return (
        <div className="space-y-6 animate-fade-in-up p-1">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center gap-3">
                    <button onClick={onBack} className="group flex items-center justify-center w-10 h-10 bg-white border border-slate-200 rounded-xl hover:border-orange-500 hover:text-orange-500 transition-all shadow-sm">
                        <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                    </button>
                    <div>
                        <div className="flex items-center gap-2 mb-0.5">
                            <div className="h-5 w-1 bg-orange-500 rounded-full"></div>
                            <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Programar <span className="text-[#1e3a8a]">Clase</span></h1>
                        </div>
                        <p className="text-slate-500 text-[11px] font-bold uppercase tracking-wide ml-3">Gestión de <span className="text-orange-500">Horarios Múltiples</span></p>
                    </div>
                </div>

                <button onClick={handleSubmit} disabled={loading} className="bg-gradient-to-r from-[#1e3a8a] to-[#0f172a] hover:from-orange-500 hover:to-orange-600 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-blue-900/20 active:scale-95 disabled:opacity-50">
                    <Save size={20} /> {loading ? 'PUBLICANDO...' : 'GUARDAR PROGRAMACIÓN'}
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    {/* Selección de Días */}
                    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                        <div className="p-6 border-b border-slate-100 bg-[#f8fafc] flex items-center gap-3">
                            <div className="p-2 bg-orange-100 text-orange-600 rounded-lg"><Clock size={20} /></div>
                            <h3 className="font-black text-[#1e3a8a] uppercase text-xs tracking-wider">Días de la Semana</h3>
                        </div>
                        <div className="p-6 flex flex-wrap gap-2">
                            {diasSemana.map((dia) => (
                                <button
                                    key={dia.id}
                                    onClick={() => toggleDia(dia.id)}
                                    className={`flex-1 min-w-[70px] py-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${formData.dias_seleccionados.includes(dia.id)
                                            ? "border-[#1e3a8a] bg-blue-50 text-[#1e3a8a] shadow-md shadow-blue-100"
                                            : "border-slate-100 bg-slate-50 text-slate-400 hover:border-slate-200"
                                        }`}
                                >
                                    <span className="text-xs font-black uppercase tracking-tighter">{dia.label}</span>
                                    {formData.dias_seleccionados.includes(dia.id) && <CheckCircle2 size={16} />}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Recursos */}
                    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                        <div className="p-6 border-b border-slate-100 bg-[#f8fafc] flex items-center gap-3">
                            <div className="p-2 bg-blue-100 text-[#1e3a8a] rounded-lg"><MapPin size={20} /></div>
                            <h3 className="font-black text-[#1e3a8a] uppercase text-xs tracking-wider">Asignación</h3>
                        </div>
                        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                            <select name="profesor_id" onChange={handleChange} className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold outline-none focus:ring-2 focus:ring-blue-500">
                                <option value="">Selecciona Profesor...</option>
                                <option value="1">Prof. Ricardo Gareca</option>
                            </select>
                            <select name="cancha_id" onChange={handleChange} className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold outline-none focus:ring-2 focus:ring-blue-500">
                                <option value="">Selecciona Cancha...</option>
                                <option value="1">Cancha Principal Surco</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    {/* Tiempo y Capacidad */}
                    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden p-6 space-y-4">
                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Rango Horario</label>
                            <div className="grid grid-cols-2 gap-2">
                                <input name="hora_inicio" type="time" onChange={handleChange} className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-bold" />
                                <input name="hora_fin" type="time" onChange={handleChange} className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-bold" />
                            </div>
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Capacidad Máxima</label>
                            <input name="capacidad_max" type="number" defaultValue={20} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm font-bold outline-none" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminSchedule;