import React, { useState, useEffect } from 'react';
import { ArrowLeft, Save, Clock, MapPin, User, Trophy, Users, Loader2, Plus, Trash2, CalendarDays, Copy } from 'lucide-react';
import { apiFetch } from '../../interceptors/api';
import toast from 'react-hot-toast';

const AdminSchedule = ({ onBack }) => {
    const [loading, setLoading] = useState(false);
    const [fetchingData, setFetchingData] = useState(true);

    const [sedes, setSedes] = useState([]);
    const [canchas, setCanchas] = useState([]);
    const [profesores, setProfesores] = useState([]);
    const [niveles, setNiveles] = useState([]);

    const [commonData, setCommonData] = useState({
        sede_id: '',
        cancha_id: '',
        profesor_id: '',
        nivel_id: '',
        capacidad_max: 20
    });

    const [bloques, setBloques] = useState([
        { id: Date.now(), dia_semana: '', hora_inicio: '', hora_fin: '' }
    ]);

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
                    setSedes(json.data || json); // Flexible si viene envuelto o no
                }
                if (resProfesores.ok) {
                    const json = await resProfesores.json();
                    setProfesores(json.data || json);
                }
                if (resNiveles.ok) {
                    const json = await resNiveles.json();
                    // FIX: Tu controlador de niveles devuelve res.status(200).json(niveles) (un array directo)
                    setNiveles(Array.isArray(json) ? json : (json.data || []));
                }
            } catch (error) {
                toast.error("Error al cargar catálogos");
            } finally {
                setFetchingData(false);
            }
        };
        loadInitialData();
    }, []);

    useEffect(() => {
        if (!commonData.sede_id) return;
        apiFetch.get(`/sedes/${commonData.sede_id}`).then(async res => {
            if (res.ok) {
                const json = await res.json();
                setCanchas(json.data?.canchas || json.canchas || []);
            }
        });
    }, [commonData.sede_id]);

    const addBloque = () => {
        setBloques([...bloques, { id: Date.now(), dia_semana: '', hora_inicio: '', hora_fin: '' }]);
    };

    const duplicarBloque = (bloque) => {
        setBloques([...bloques, { ...bloque, id: Date.now() }]);
    };

    const removeBloque = (id) => {
        if (bloques.length === 1) return;
        setBloques(bloques.filter(b => b.id !== id));
    };

    const updateBloque = (id, field, value) => {
        setBloques(bloques.map(b => b.id === id ? { ...b, [field]: value } : b));
    };

    const handleSubmit = async () => {
        if (!commonData.cancha_id || !commonData.profesor_id || !commonData.nivel_id) {
            return toast.error("Completa sede, cancha, nivel y profesor");
        }
        const incompletos = bloques.some(b => !b.dia_semana || !b.hora_inicio || !b.hora_fin);
        if (incompletos) return toast.error("Completa todos los bloques de tiempo");

        setLoading(true);
        try {
            const promesas = bloques.map(bloque => {
                const payload = {
                    ...commonData,
                    dia_semana: bloque.dia_semana,
                    hora_inicio: bloque.hora_inicio,
                    hora_fin: bloque.hora_fin
                };
                return apiFetch.post('/horarios', payload);
            });

            const resultados = await Promise.all(promesas);
            const exitosos = resultados.filter(r => r.ok).length;

            if (exitosos === bloques.length) {
                toast.success("¡Todos los horarios programados!");
                onBack();
            } else {
                toast.error(`Se crearon ${exitosos} de ${bloques.length}. Revisa solapamientos.`);
            }
        } catch (error) {
            toast.error("Error al procesar la solicitud");
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
                <div className="flex items-center gap-3">
                    <button onClick={onBack} className="p-2.5 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 shadow-sm transition-all"><ArrowLeft size={20} /></button>
                    <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tight italic">Programar <span className="text-[#1e3a8a]">Cronograma</span></h1>
                </div>
                <button onClick={handleSubmit} disabled={loading} className="bg-[#0f172a] hover:bg-orange-600 text-white px-8 py-3 rounded-xl font-black text-xs uppercase flex items-center gap-2 shadow-lg disabled:opacity-50 transition-all">
                    {loading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                    {loading ? 'Guardando...' : 'Confirmar Todo'}
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
                        <h3 className="text-[10px] font-black text-[#1e3a8a] uppercase tracking-[0.2em] mb-4">Configuración Base</h3>
                        <div className="space-y-4">
                            <div className="space-y-1">
                                <label className="text-[9px] font-black text-slate-400 uppercase">Sede</label>
                                <select value={commonData.sede_id} onChange={(e) => setCommonData({ ...commonData, sede_id: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold outline-none">
                                    <option value="">Sede...</option>
                                    {sedes.map(s => <option key={s.id} value={s.id}>{s.nombre}</option>)}
                                </select>
                            </div>
                            <div className="space-y-1">
                                <label className="text-[9px] font-black text-slate-400 uppercase">Cancha</label>
                                <select value={commonData.cancha_id} onChange={(e) => setCommonData({ ...commonData, cancha_id: e.target.value })} disabled={!commonData.sede_id} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold outline-none">
                                    <option value="">Cancha...</option>
                                    {canchas.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
                                </select>
                            </div>
                            <div className="space-y-1">
                                <label className="text-[9px] font-black text-slate-400 uppercase">Profesor</label>
                                <select value={commonData.profesor_id} onChange={(e) => setCommonData({ ...commonData, profesor_id: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold outline-none">
                                    <option value="">Profesor...</option>
                                    {profesores.map(p => <option key={p.id} value={p.id}>{p.name || `${p.nombres} ${p.apellidos}`}</option>)}
                                </select>
                            </div>
                            <div className="space-y-1">
                                <label className="text-[9px] font-black text-slate-400 uppercase">Nivel</label>
                                <select value={commonData.nivel_id} onChange={(e) => setCommonData({ ...commonData, nivel_id: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold outline-none">
                                    <option value="">Nivel...</option>
                                    {niveles.map(n => <option key={n.id} value={n.id}>{n.nombre}</option>)}
                                </select>
                            </div>
                            <div className="space-y-1">
                                <label className="text-[9px] font-black text-slate-400 uppercase">Aforo Máx</label>
                                <input type="number" value={commonData.capacidad_max} onChange={(e) => setCommonData({ ...commonData, capacidad_max: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold outline-none" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-3 space-y-4">
                    <div className="flex justify-between items-center px-2">
                        <h2 className="text-sm font-black text-slate-800 uppercase italic">Bloques por Día</h2>
                        <button onClick={addBloque} className="flex items-center gap-2 text-[10px] font-black text-[#1e3a8a] bg-blue-50 px-4 py-2 rounded-xl hover:bg-[#1e3a8a] hover:text-white transition-all">
                            <Plus size={14} /> AÑADIR DÍA
                        </button>
                    </div>

                    <div className="space-y-3">
                        {bloques.map((bloque) => (
                            <div key={bloque.id} className="bg-white rounded-2xl border border-slate-200 p-4 flex flex-col md:flex-row items-end gap-3 shadow-sm">
                                <div className="flex-[1.5] space-y-1 w-full">
                                    <label className="text-[9px] font-black text-slate-400 uppercase ml-1">Día</label>
                                    <select value={bloque.dia_semana} onChange={(e) => updateBloque(bloque.id, 'dia_semana', e.target.value)} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-2 text-xs font-bold outline-none">
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
                                <div className="flex gap-2">
                                    <button onClick={() => duplicarBloque(bloque)} className="p-2.5 text-blue-400 hover:text-blue-600 bg-blue-50 rounded-xl transition-all" title="Duplicar"><Copy size={18} /></button>
                                    <button onClick={() => removeBloque(bloque.id)} className="p-2.5 text-slate-300 hover:text-red-500 bg-slate-50 rounded-xl transition-all"><Trash2 size={18} /></button>
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