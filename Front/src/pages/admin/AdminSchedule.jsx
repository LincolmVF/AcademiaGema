import React, { useState, useEffect } from 'react';
import { ArrowLeft, Save, Loader2, Plus, Trash2, Copy } from 'lucide-react';
import { apiFetch } from '../../interceptors/api';
import toast from 'react-hot-toast';

const AdminSchedule = ({ onBack, initialData }) => {
    const isEdit = !!initialData;
    const [loading, setLoading] = useState(false);
    const [fetchingData, setFetchingData] = useState(true);

    const [sedes, setSedes] = useState([]);
    const [canchas, setCanchas] = useState([]);
    const [profesores, setProfesores] = useState([]);
    const [niveles, setNiveles] = useState([]);

    // 1. IMPORTANTE: Forzamos a String todos los IDs iniciales
    const [commonData, setCommonData] = useState({
        sede_id: initialData?.cancha?.sede_id?.toString() || '',
        cancha_id: initialData?.cancha_id?.toString() || '',
        profesor_id: initialData?.profesor_id?.toString() || '',
        nivel_id: initialData?.nivel_id?.toString() || '',
        capacidad_max: initialData?.capacidad_max || 20
    });

    const [bloques, setBloques] = useState(
        isEdit
            ? [{
                id: initialData.id,
                dia_semana: initialData.dia_semana?.toString() || '',
                hora_inicio: initialData.hora_inicio || '',
                hora_fin: initialData.hora_fin || ''
            }]
            : [{ id: Date.now(), dia_semana: '', hora_inicio: '', hora_fin: '' }]
    );

    useEffect(() => {
        const loadInitialData = async () => {
            try {
                setFetchingData(true);
                const [resSedes, resProfesores, resNiveles] = await Promise.all([
                    apiFetch.get('/sedes'),
                    apiFetch.get('/usuarios/role/profesor'),
                    apiFetch.get('/niveles')
                ]);

                if (resSedes.ok) {
                    const json = await resSedes.json();
                    setSedes(json.data || json);
                }
                if (resProfesores.ok) {
                    const json = await resProfesores.json();
                    setProfesores(json.data || json);
                }
                if (resNiveles.ok) {
                    const json = await resNiveles.json();
                    setNiveles(Array.isArray(json) ? json : (json.data || []));
                }

                // 2. CARGA DE CANCHAS INMEDIATA: Si editamos, necesitamos las canchas de esa sede YA.
                if (isEdit && initialData?.cancha?.sede_id) {
                    const resCanchas = await apiFetch.get(`/sedes/${initialData.cancha.sede_id}`);
                    if (resCanchas.ok) {
                        const json = await resCanchas.json();
                        setCanchas(json.data?.canchas || json.canchas || []);
                    }
                }
            } catch (error) {
                toast.error("Error al cargar catálogos");
            } finally {
                setFetchingData(false);
            }
        };
        loadInitialData();
    }, [isEdit]); // Solo se ejecuta al montar

    // Manejador para cambios de Sede manuales
    useEffect(() => {
        // Si no hay sede o estamos en carga inicial de edición, no limpiar canchas
        if (!commonData.sede_id || (isEdit && fetchingData)) return;

        const loadCanchas = async () => {
            const res = await apiFetch.get(`/sedes/${commonData.sede_id}`);
            if (res.ok) {
                const json = await res.json();
                setCanchas(json.data?.canchas || json.canchas || []);
            }
        };
        loadCanchas();
    }, [commonData.sede_id]);

    const addBloque = () => {
        setBloques([...bloques, { id: Date.now(), dia_semana: '', hora_inicio: '', hora_fin: '' }]);
    };

    const updateBloque = (id, field, value) => {
        setBloques(bloques.map(b => b.id === id ? { ...b, [field]: value } : b));
    };

    const handleSubmit = async () => {
        if (!commonData.cancha_id || !commonData.profesor_id || !commonData.nivel_id) {
            return toast.error("Por favor, completa todos los campos obligatorios");
        }

        setLoading(true);
        try {
            const promesas = bloques.map(bloque => {
                const payload = {
                    sede_id: Number(commonData.sede_id),
                    cancha_id: Number(commonData.cancha_id),
                    profesor_id: Number(commonData.profesor_id),
                    nivel_id: Number(commonData.nivel_id),
                    capacidad_max: Number(commonData.capacidad_max),
                    dia_semana: Number(bloque.dia_semana),
                    hora_inicio: bloque.hora_inicio,
                    hora_fin: bloque.hora_fin
                };

                if (isEdit) return apiFetch.put(`/horarios/${initialData.id}`, payload);
                return apiFetch.post('/horarios', payload);
            });

            const resultados = await Promise.all(promesas);
            if (resultados.every(res => res.ok)) {
                toast.success(isEdit ? "Horario actualizado" : "Horarios creados");
                onBack();
            } else {
                const errorData = await resultados[0].json();
                toast.error(errorData.message || "Error en la operación");
            }
        } catch (error) {
            toast.error("Error de conexión");
        } finally {
            setLoading(false);
        }
    };

    if (fetchingData) return (
        <div className="flex justify-center p-20"><Loader2 className="animate-spin text-orange-500" size={30} /></div>
    );

    return (
        <div className="space-y-6 animate-fade-in-up p-1">
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <button onClick={onBack} className="p-2.5 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 shadow-sm transition-all"><ArrowLeft size={20} /></button>
                    <div>
                        <h1 className="text-2xl font-black italic uppercase tracking-tight">
                            {isEdit ? 'Editar' : 'Programar'} <span className="text-[#1e3a8a]">Horario</span>
                        </h1>
                    </div>
                </div>
                <button onClick={handleSubmit} disabled={loading} className="bg-[#0f172a] hover:bg-orange-600 text-white px-8 py-3 rounded-xl font-black text-xs uppercase flex items-center gap-2 shadow-lg disabled:opacity-50 transition-all">
                    {loading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                    {isEdit ? 'Guardar Cambios' : 'Confirmar Todo'}
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
                        <div className="space-y-4">
                            <div className="space-y-1">
                                <label className="text-[9px] font-black text-slate-400 uppercase">Sede</label>
                                <select
                                    value={commonData.sede_id}
                                    onChange={(e) => setCommonData({ ...commonData, sede_id: e.target.value, cancha_id: '' })}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold outline-none"
                                >
                                    <option value="">Sede...</option>
                                    {sedes.map(s => <option key={s.id} value={s.id.toString()}>{s.nombre}</option>)}
                                </select>
                            </div>
                            <div className="space-y-1">
                                <label className="text-[9px] font-black text-slate-400 uppercase">Cancha</label>
                                <select
                                    value={commonData.cancha_id}
                                    onChange={(e) => setCommonData({ ...commonData, cancha_id: e.target.value })}
                                    disabled={!commonData.sede_id}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold outline-none"
                                >
                                    <option value="">Cancha...</option>
                                    {canchas.map(c => <option key={c.id} value={c.id.toString()}>{c.nombre}</option>)}
                                </select>
                            </div>
                            <div className="space-y-1">
                                <label className="text-[9px] font-black text-slate-400 uppercase">Profesor</label>
                                <select
                                    value={commonData.profesor_id}
                                    onChange={(e) => setCommonData({ ...commonData, profesor_id: e.target.value })}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold outline-none"
                                >
                                    <option value="">Profesor...</option>
                                    {profesores.map(p => <option key={p.id} value={p.id.toString()}>{p.name || `${p.nombres} ${p.apellidos}`}</option>)}
                                </select>
                            </div>
                            <div className="space-y-1">
                                <label className="text-[9px] font-black text-slate-400 uppercase">Nivel</label>
                                <select
                                    value={commonData.nivel_id}
                                    onChange={(e) => setCommonData({ ...commonData, nivel_id: e.target.value })}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold outline-none"
                                >
                                    <option value="">Nivel...</option>
                                    {niveles.map(n => <option key={n.id} value={n.id.toString()}>{n.nombre}</option>)}
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-3 space-y-4">
                    <div className="space-y-3">
                        {bloques.map((bloque) => (
                            <div key={bloque.id} className="bg-white rounded-2xl border border-slate-200 p-4 flex flex-col md:flex-row items-end gap-3 shadow-sm">
                                <div className="flex-[1.5] space-y-1 w-full">
                                    <label className="text-[9px] font-black text-slate-400 uppercase ml-1">Día</label>
                                    <select
                                        value={bloque.dia_semana}
                                        onChange={(e) => updateBloque(bloque.id, 'dia_semana', e.target.value)}
                                        className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-2 text-xs font-bold outline-none"
                                    >
                                        <option value="">Seleccionar...</option>
                                        <option value="1">Lunes</option><option value="2">Martes</option>
                                        <option value="3">Miércoles</option><option value="4">Jueves</option>
                                        <option value="5">Viernes</option><option value="6">Sábado</option>
                                        <option value="7">Domingo</option>
                                    </select>
                                </div>
                                <div className="flex-1 space-y-1 w-full">
                                    <label className="text-[9px] font-black text-slate-400 uppercase ml-1">Inicio</label>
                                    <input type="time" value={bloque.hora_inicio} onChange={(e) => updateBloque(bloque.id, 'hora_inicio', e.target.value)} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-2 text-xs font-bold outline-none" />
                                </div>
                                <div className="flex-1 space-y-1 w-full">
                                    <label className="text-[9px] font-black text-slate-400 uppercase ml-1">Fin</label>
                                    <input type="time" value={bloque.hora_fin} onChange={(e) => updateBloque(bloque.id, 'hora_fin', e.target.value)} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-2 text-xs font-bold outline-none" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminSchedule;