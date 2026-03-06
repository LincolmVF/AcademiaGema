import React, { useState, useEffect } from 'react';
import { ArrowLeft, Save, Loader2, Calendar, MapPin, User, Home, Clock, Plus, Trash2 } from 'lucide-react';
import { apiFetch } from '../../interceptors/api';
import toast from 'react-hot-toast';
import { API_ROUTES } from '../../constants/apiRoutes';

const AdminSchedule = ({ onBack, initialData }) => {
    const isEdit = !!initialData;
    const [loading, setLoading] = useState(false);
    const [fetchingData, setFetchingData] = useState(true);

    const [sedes, setSedes] = useState([]);
    const [canchas, setCanchas] = useState([]);
    const [coordinadores, setCoordinadores] = useState([]);
    const [niveles, setNiveles] = useState([]);

    const [commonData, setCommonData] = useState({
        sede_id: initialData?.cancha?.sede?.id?.toString() || '',
        cancha_id: initialData?.cancha?.id?.toString() || '',
        coordinador_id: initialData?.coordinador?.id?.toString() || '', 
        nivel_id: initialData?.nivel?.id?.toString() || '',
        capacidad_max: initialData?.capacidad_max || 20
    });

    const [bloques, setBloques] = useState(
        isEdit
            ? [{
                id: initialData.id,
                dia_semana: initialData.dia_semana?.toString() || '',
                hora_inicio: initialData.hora_inicio ? initialData.hora_inicio.substring(0, 5) : '',
                hora_fin: initialData.hora_fin ? initialData.hora_fin.substring(0, 5) : ''
            }]
            : [{ id: Date.now(), dia_semana: '', hora_inicio: '', hora_fin: '' }]
    );

    useEffect(() => {
        const loadInitialData = async () => {
            try {
                setFetchingData(true);
                const [resSedes, resCoordinadores, resNiveles] = await Promise.all([
                    apiFetch.get(API_ROUTES.SEDES.BASE),
                    apiFetch.get(API_ROUTES.USUARIOS.COORDINADORES),
                    apiFetch.get(API_ROUTES.NIVELES.BASE)
                ]);

                if (resSedes.ok) setSedes((await resSedes.json()).data || []);
                
                // CARGA SEGÚN TU ESTRUCTURA JSON (data: [{ nombres, apellidos, id }])
                if (resCoordinadores.ok) {
                    const resJson = await resCoordinadores.json();
                    setCoordinadores(resJson.data || []);
                }
                
                if (resNiveles.ok) setNiveles((await resNiveles.json()).data || []);

                const sId = initialData?.cancha?.sede?.id || initialData?.sede_id;
                if (isEdit && sId) {
                    const resCanchas = await apiFetch.get(API_ROUTES.SEDES.BY_ID(sId));
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
    }, [isEdit, initialData]);

    useEffect(() => {
        if (fetchingData || !commonData.sede_id) return;
        const loadCanchas = async () => {
            const res = await apiFetch.get(API_ROUTES.SEDES.BY_ID(commonData.sede_id));
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

    const removeBloque = (id) => {
        if (bloques.length > 1) setBloques(bloques.filter(b => b.id !== id));
    };

    const updateBloque = (id, field, value) => {
        setBloques(bloques.map(b => b.id === id ? { ...b, [field]: value } : b));
    };

    const handleSubmit = async () => {
        if (!commonData.cancha_id || !commonData.nivel_id) {
            return toast.error("Cancha y Nivel son obligatorios");
        }

        setLoading(true);
        try {
            const promesas = bloques.map(bloque => {
                // LIMPIEZA CRÍTICA: Convertir cadena vacía a NULL real para Zod
                const payload = {
                    cancha_id: parseInt(commonData.cancha_id),
                    coordinador_id: commonData.coordinador_id === "" ? null : parseInt(commonData.coordinador_id),
                    nivel_id: parseInt(commonData.nivel_id),
                    capacidad_max: parseInt(commonData.capacidad_max),
                    dia_semana: parseInt(bloque.dia_semana),
                    hora_inicio: bloque.hora_inicio,
                    hora_fin: bloque.hora_fin
                };

                return isEdit
                    ? apiFetch.put(API_ROUTES.HORARIOS.BY_ID(bloque.id), payload)
                    : apiFetch.post(API_ROUTES.HORARIOS.BASE, payload);
            });

            const resultados = await Promise.all(promesas);
            if (resultados.every(res => res.ok)) {
                toast.success("Programación guardada");
                onBack();
            } else {
                const err = await resultados[0].json();
                toast.error(err.message || "Error al validar datos");
            }
        } catch (e) {
            toast.error("Error de conexión");
        } finally {
            setLoading(false);
        }
    };

    if (fetchingData) return <div className="flex justify-center p-20"><Loader2 className="animate-spin text-blue-600" size={40} /></div>;

    return (
        <div className="space-y-6 p-1 text-slate-800">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center gap-4">
                    <button onClick={onBack} className="p-2.5 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all shadow-sm">
                        <ArrowLeft size={20} className="text-slate-600" />
                    </button>
                    <h1 className="text-2xl font-black italic uppercase tracking-tight text-[#1e3a8a]">
                        {isEdit ? 'Editar' : 'Programar'} <span className="text-orange-500">Clase</span>
                    </h1>
                </div>
                <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="bg-[#1e3a8a] hover:bg-orange-500 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg transition-all"
                >
                    {loading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                    {isEdit ? 'Actualizar' : 'Confirmar'}
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    {/* Tarjeta de Ubicación */}
                    <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-6">
                        <h3 className="font-black text-[10px] uppercase tracking-[0.2em] text-slate-400 mb-6 ml-1">Configuración de Espacio</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <select
                                value={commonData.sede_id}
                                onChange={(e) => setCommonData({ ...commonData, sede_id: e.target.value, cancha_id: '' })}
                                className="w-full bg-slate-50 border-none rounded-2xl px-5 py-3.5 text-sm font-bold text-slate-700 focus:ring-2 focus:ring-[#1e3a8a]"
                            >
                                <option value="">Seleccionar Sede</option>
                                {sedes.map(s => <option key={s.id} value={s.id.toString()}>{s.nombre}</option>)}
                            </select>
                            <select
                                value={commonData.cancha_id}
                                onChange={(e) => setCommonData({ ...commonData, cancha_id: e.target.value })}
                                disabled={!commonData.sede_id}
                                className="w-full bg-slate-50 border-none rounded-2xl px-5 py-3.5 text-sm font-bold text-slate-700 focus:ring-2 focus:ring-[#1e3a8a] disabled:opacity-50"
                            >
                                <option value="">Seleccionar Cancha</option>
                                {canchas.map(c => <option key={c.id} value={c.id.toString()}>{c.nombre}</option>)}
                            </select>
                        </div>
                    </div>

                    {/* Tarjeta de Personal */}
                    <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-6">
                        <h3 className="font-black text-[10px] uppercase tracking-[0.2em] text-slate-400 mb-6 ml-1">Asignación de Coach</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <select
                                value={commonData.coordinador_id}
                                onChange={(e) => setCommonData({ ...commonData, coordinador_id: e.target.value })}
                                className={`w-full bg-slate-50 border-none rounded-2xl px-5 py-3.5 text-sm font-bold focus:ring-2 focus:ring-orange-500 transition-all ${commonData.coordinador_id === "" ? "text-orange-500 italic" : "text-slate-700"}`}
                            >
                                <option value="" className="not-italic text-slate-400">-- SIN ASIGNAR / QUITAR --</option>
                                {coordinadores.map(c => (
                                    <option key={c.id} value={c.id.toString()} className="not-italic">
                                        {c.nombres} {c.apellidos}
                                    </option>
                                ))}
                            </select>
                            <select
                                value={commonData.nivel_id}
                                onChange={(e) => setCommonData({ ...commonData, nivel_id: e.target.value })}
                                className="w-full bg-slate-50 border-none rounded-2xl px-5 py-3.5 text-sm font-bold text-slate-700 focus:ring-2 focus:ring-[#1e3a8a]"
                            >
                                <option value="">Seleccionar Nivel</option>
                                {niveles.map(n => <option key={n.id} value={n.id.toString()}>{n.nombre}</option>)}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Resumen Lateral */}
                <div className="space-y-6">
                    <div className="bg-[#1e3a8a] rounded-[2.5rem] p-8 text-white relative overflow-hidden group shadow-2xl shadow-blue-900/20">
                        <div className="relative z-10">
                            <h4 className="font-black uppercase italic text-xl mb-6 text-orange-500 tracking-tighter">Resumen Programación</h4>
                            <div className="space-y-4 opacity-90 text-[11px] font-bold uppercase tracking-widest">
                                <div className="flex justify-between border-b border-white/10 pb-2">
                                    <span className="text-blue-200">Coach:</span>
                                    <span>
                                        {coordinadores.find(c => c.id.toString() === commonData.coordinador_id) 
                                            ? coordinadores.find(c => c.id.toString() === commonData.coordinador_id).nombres.split(' ')[0] 
                                            : 'PENDIENTE'}
                                    </span>
                                </div>
                                <div className="flex justify-between border-b border-white/10 pb-2">
                                    <span className="text-blue-200">Sede:</span>
                                    <span>{sedes.find(s => s.id.toString() === commonData.sede_id)?.nombre || '---'}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-blue-200">Bloques:</span>
                                    <span className="bg-orange-500 px-2 py-0.5 rounded-lg text-white">{bloques.length}</span>
                                </div>
                            </div>
                        </div>
                        <Calendar size={140} className="absolute -right-10 -bottom-10 opacity-10 rotate-12 group-hover:scale-110 transition-transform duration-700" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminSchedule;