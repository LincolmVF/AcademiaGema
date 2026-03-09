import React, { useState, useEffect } from 'react';
import { 
    CalendarRange, 
    Send, 
    AlertTriangle, 
    Loader2, 
    Search, 
    Filter, 
    Clock, 
    ClipboardList,
    Layers
} from 'lucide-react';
import apiFetch from '../../interceptors/api';
import { API_ROUTES } from '../../constants/apiRoutes';
import toast from 'react-hot-toast';

const MassRescheduleForm = () => {
    const [horarios, setHorarios] = useState([]);
    const [isLoadingHorarios, setIsLoadingHorarios] = useState(true);
    const [fechasDisponibles, setFechasDisponibles] = useState([]);
    const [isLoadingFechas, setIsLoadingFechas] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        horario_origen_id: '',
        fecha_origen: '',
        fecha_destino: '',
        hora_inicio_destino: '',
        hora_fin_destino: '',
        motivo: ''
    });

    const [filterDay, setFilterDay] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchHorarios();
    }, []);

    useEffect(() => {
        if (formData.horario_origen_id) {
            fetchFechasDisponibles(formData.horario_origen_id);
            const selectedHorario = horarios.find(h => h.id.toString() === formData.horario_origen_id.toString());
            if (selectedHorario) {
                setFormData(prev => ({
                    ...prev,
                    hora_inicio_destino: selectedHorario.hora_inicio.substring(0, 5),
                    hora_fin_destino: selectedHorario.hora_fin.substring(0, 5)
                }));
            }
        } else {
            setFechasDisponibles([]);
            setFormData(prev => ({ ...prev, fecha_origen: '', hora_inicio_destino: '', hora_fin_destino: '' }));
        }
    }, [formData.horario_origen_id, horarios]);

    const fetchHorarios = async () => {
        try {
            const response = await apiFetch.get(API_ROUTES.CLASES.HORARIOS_CON_ASISTENCIA);
            const json = await response.json();
            setHorarios(json.data || json || []);
        } catch (error) {
            console.error('Error fetching horarios:', error);
            toast.error('No se pudieron cargar los horarios disponibles.');
        } finally {
            setIsLoadingHorarios(false);
        }
    };

    const fetchFechasDisponibles = async (horarioId) => {
        setIsLoadingFechas(true);
        try {
            const response = await apiFetch.get(`/clases/${horarioId}/fechas-disponibles`);
            const json = await response.json();
            setFechasDisponibles(json.data || json || []);
        } catch (error) {
            console.error('Error fetching fechas:', error);
            toast.error('No se pudieron cargar las fechas disponibles de este horario.');
            setFechasDisponibles([]);
        } finally {
            setIsLoadingFechas(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.horario_origen_id || !formData.fecha_origen || !formData.fecha_destino || !formData.motivo) {
            toast.error("Por favor completa todos los campos.");
            return;
        }

        if (formData.motivo.length < 3) {
            toast.error("El motivo debe ser más descriptivo.");
            return;
        }

        setIsSubmitting(true);

        try {
            const response = await apiFetch.post(API_ROUTES.CLASES.REPROGRAMAR_MASIVO, {
                horario_origen_id: Number.parseInt(formData.horario_origen_id),
                fecha_origen: formData.fecha_origen,
                fecha_destino: formData.fecha_destino,
                hora_inicio_destino: formData.hora_inicio_destino || undefined,
                hora_fin_destino: formData.hora_fin_destino || undefined,
                motivo: formData.motivo
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || 'Error en el servidor al reprogramar la clase.');
            }

            toast.success('Reprogramación masiva ejecutada con éxito. Los alumnos afectados han sido notificados.', {
                duration: 5000
            });
            
            // Reset form
            setFormData({
                horario_origen_id: '',
                fecha_origen: '',
                fecha_destino: '',
                hora_inicio_destino: '',
                hora_fin_destino: '',
                motivo: ''
            });

        } catch (error) {
            console.error("Error reprogramando:", error);
            toast.error(error.message || 'Error al ejecutar la reprogramación masiva.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const diasSemana = {
        1: 'Lunes', 2: 'Martes', 3: 'Miércoles', 4: 'Jueves',
        5: 'Viernes', 6: 'Sábado', 7: 'Domingo'
    };

    const getFechaOrigenPlaceholder = () => {
        if (!formData.horario_origen_id) return "Esperando horario...";
        if (isLoadingFechas) return "Buscando fechas...";
        if (fechasDisponibles.length === 0) return "Sin clases programadas";
        return "Elige el día que falló";
    };

    const filteredHorarios = horarios.filter(h => {
        const matchesDay = filterDay === '' || h.dia_semana.toString() === filterDay;
        const searchLower = searchTerm.toLowerCase();
        const matchesSearch = searchTerm === '' || 
            diasSemana[h.dia_semana].toLowerCase().includes(searchLower) ||
            h.nivel?.nombre?.toLowerCase().includes(searchLower) ||
            h.cancha?.nombre?.toLowerCase().includes(searchLower) ||
            h.cancha?.sede?.nombre?.toLowerCase().includes(searchLower);
        
        return matchesDay && matchesSearch;
    });

    return (
        <div className="max-w-5xl mx-auto">
            {/* Header Section */}
            <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm transition-all hover:shadow-md">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-orange-100 text-orange-600 rounded-2xl shadow-inner">
                        <CalendarRange size={32} />
                    </div>
                    <div>
                        <h2 className="text-2xl font-black text-slate-800 tracking-tight">Reprogramación Masiva</h2>
                        <p className="text-slate-500 text-sm font-medium">Reasigna clases completas por motivos institucionales</p>
                    </div>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">{filteredHorarios.length} Horarios Listos</span>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8 animate-in fade-in duration-500">
                
                {/* Warning Alert */}
                <div className="bg-gradient-to-r from-orange-50 to-amber-50 border-l-4 border-orange-500 p-6 rounded-r-2xl shadow-sm">
                    <div className="flex gap-4">
                        <div className="flex-shrink-0">
                            <AlertTriangle className="h-6 w-6 text-orange-500" />
                        </div>
                        <div>
                            <h4 className="text-sm font-bold text-orange-800 uppercase tracking-wider mb-1">Advertencia Crítica</h4>
                            <p className="text-sm text-orange-700/90 leading-relaxed italic">
                                Esta acción modificará permanentemente las asistencias de todos los alumnos inscritos. Se enviará una notificación automática a cada uno de ellos informando el cambio y el motivo.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50 space-y-8">
                    {/* Filter Section */}
                    <div className="p-6 bg-slate-50/80 rounded-2xl border border-slate-200/60 backdrop-blur-sm">
                        <div className="flex items-center gap-2 mb-4">
                            <Filter size={18} className="text-slate-400" />
                            <span className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Filtros Rápidos</span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="relative group">
                                <label htmlFor="filterDay" className="absolute -top-2.5 left-3 px-2 bg-white text-[10px] font-black text-slate-400 uppercase tracking-widest border border-slate-100 rounded-full group-focus-within:text-orange-500 transition-colors">Día</label>
                                <select
                                    id="filterDay"
                                    value={filterDay}
                                    onChange={(e) => setFilterDay(e.target.value)}
                                    className="w-full pl-4 pr-10 py-3.5 rounded-xl border border-slate-200 bg-white group-focus-within:border-orange-400 focus:ring-4 focus:ring-orange-500/10 outline-none text-sm transition-all appearance-none font-semibold text-slate-600 shadow-sm"
                                >
                                    <option value="">Todos los días</option>
                                    {Object.entries(diasSemana).map(([val, label]) => (
                                        <option key={val} value={val}>{label}</option>
                                    ))}
                                </select>
                                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400">
                                    <Clock size={16} />
                                </div>
                            </div>
                            <div className="md:col-span-2 relative group">
                                <label htmlFor="searchTerm" className="absolute -top-2.5 left-3 px-2 bg-white text-[10px] font-black text-slate-400 uppercase tracking-widest border border-slate-100 rounded-full group-focus-within:text-orange-500 transition-colors">Buscar</label>
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-orange-500 transition-colors">
                                    <Search size={18} />
                                </div>
                                <input
                                    id="searchTerm"
                                    type="text"
                                    placeholder="Nivel, Sede o Cancha..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-slate-200 bg-white group-focus-within:border-orange-400 focus:ring-4 focus:ring-orange-500/10 outline-none text-sm transition-all font-semibold text-slate-600 placeholder:text-slate-300 shadow-sm"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                        {/* Horario Selector */}
                        <div className="col-span-1 md:col-span-2 space-y-2">
                            <label htmlFor="horario_origen_id" className="flex items-center gap-2 text-sm font-black text-slate-700 uppercase tracking-wider pl-1">
                                <Layers size={16} className="text-orange-500" />
                                Horario Afectado <span className="text-orange-500">*</span>
                            </label>
                            <select
                                id="horario_origen_id"
                                name="horario_origen_id"
                                value={formData.horario_origen_id}
                                onChange={handleChange}
                                className="w-full px-5 py-4 rounded-2xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-200/50 outline-none transition-all font-bold text-slate-700 shadow-sm"
                                disabled={isLoadingHorarios}
                                required
                            >
                                <option value="">
                                    {isLoadingHorarios ? "Cargando horarios..." : `Selecciona un horario (${filteredHorarios.length} disponibles)`}
                                </option>
                                {filteredHorarios.map(h => (
                                    <option key={h.id} value={h.id}>
                                        {`[${diasSemana[h.dia_semana]}] ${h.hora_inicio.substring(0,5)} - ${h.hora_fin.substring(0,5)} | ${h.nivel?.nombre || 'General'} | ${h.cancha?.sede?.nombre} (${h.cancha?.nombre})`}
                                    </option>
                                ))}
                            </select>
                            {filteredHorarios.length === 0 && !isLoadingHorarios && (
                                <div className="flex items-center gap-2 p-3 bg-red-50 text-red-600 rounded-xl border border-red-100 animate-pulse">
                                    <AlertTriangle size={14} />
                                    <p className="text-[10px] font-black uppercase tracking-widest">No hay horarios que coincidan con los filtros</p>
                                </div>
                            )}
                        </div>

                        {/* Date Picker - Origen */}
                        <div className="space-y-2">
                            <label htmlFor="fecha_origen" className="flex items-center gap-2 text-sm font-black text-slate-700 uppercase tracking-wider pl-1">
                                <CalendarRange size={16} className="text-orange-500" />
                                Fecha Original <span className="text-orange-500">*</span>
                            </label>
                            <div className="relative">
                                <select
                                    id="fecha_origen"
                                    name="fecha_origen"
                                    value={formData.fecha_origen}
                                    onChange={handleChange}
                                    className={`w-full px-5 py-4 rounded-2xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-200/50 outline-none transition-all font-bold text-slate-700 shadow-sm appearance-none ${isLoadingFechas ? 'opacity-50 cursor-wait' : ''}`}
                                    disabled={!formData.horario_origen_id || isLoadingFechas}
                                    required
                                >
                                    <option value="">
                                        {getFechaOrigenPlaceholder()}
                                    </option>
                                    {fechasDisponibles.map(fecha => (
                                        <option key={fecha} value={fecha}>{fecha}</option>
                                    ))}
                                </select>
                                <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-slate-400">
                                    <CalendarRange size={20} />
                                </div>
                            </div>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight pl-1 italic">Solo fechas con asistencias generadas</p>
                        </div>

                        {/* Date Picker - Destino */}
                        <div className="space-y-2">
                            <label htmlFor="fecha_destino" className="flex items-center gap-2 text-sm font-black text-slate-700 uppercase tracking-wider pl-1">
                                <CalendarRange size={16} className="text-blue-500" />
                                Nueva Fecha <span className="text-blue-500">*</span>
                            </label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-blue-500">
                                    <CalendarRange size={20} />
                                </div>
                                <input
                                    id="fecha_destino"
                                    type="date"
                                    name="fecha_destino"
                                    value={formData.fecha_destino}
                                    onChange={handleChange}
                                    className="w-full pl-14 pr-5 py-4 rounded-2xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all font-bold text-slate-700 shadow-sm"
                                    required
                                />
                            </div>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight pl-1 italic">Día de la reposición oficial</p>
                        </div>

                        {/* Revised Time - Container */}
                        <div className="col-span-1 md:col-span-2 p-6 bg-blue-50/30 rounded-3xl border border-dashed border-blue-200 flex flex-col md:flex-row gap-6">
                            {/* Time Picker - Inicio */}
                            <div className="flex-1 space-y-2">
                                <label htmlFor="hora_inicio_destino" className="flex items-center gap-2 font-bold text-slate-600 uppercase tracking-wider pl-1 text-[10px]">
                                    <Clock size={14} className="text-blue-400" />
                                    Hora Inicio
                                </label>
                                <input
                                    id="hora_inicio_destino"
                                    type="time"
                                    name="hora_inicio_destino"
                                    value={formData.hora_inicio_destino}
                                    onChange={handleChange}
                                    className="w-full px-5 py-3 rounded-xl border border-blue-100 bg-white focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all font-bold text-blue-600 shadow-sm text-center"
                                />
                            </div>

                            {/* Time Picker - Fin */}
                            <div className="flex-1 space-y-2">
                                <label htmlFor="hora_fin_destino" className="flex items-center gap-2 font-bold text-slate-600 uppercase tracking-wider pl-1 text-[10px]">
                                    <Clock size={14} className="text-blue-400" />
                                    Hora Fin
                                </label>
                                <input
                                    id="hora_fin_destino"
                                    type="time"
                                    name="hora_fin_destino"
                                    value={formData.hora_fin_destino}
                                    onChange={handleChange}
                                    className="w-full px-5 py-3 rounded-xl border border-blue-100 bg-white focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all font-bold text-blue-600 shadow-sm text-center"
                                />
                            </div>
                        </div>

                        {/* Motivo */}
                        <div className="col-span-1 md:col-span-2 space-y-2">
                            <label htmlFor="motivo" className="flex items-center gap-2 text-sm font-black text-slate-700 uppercase tracking-wider pl-1">
                                <ClipboardList size={18} className="text-orange-500" />
                                Motivo Institucional <span className="text-orange-500">*</span>
                            </label>
                            <textarea
                                id="motivo"
                                name="motivo"
                                value={formData.motivo}
                                onChange={handleChange}
                                rows="3"
                                className="w-full px-6 py-5 rounded-3xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-200/50 outline-none transition-all resize-none shadow-sm font-medium text-slate-600 leading-relaxed placeholder:text-slate-300"
                                placeholder="Describre brevemente la razón de este cambio masivo..."
                                required
                            ></textarea>
                            <div className="flex items-center gap-2 pl-2">
                                <div className="h-1.5 w-1.5 rounded-full bg-orange-400"></div>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest italic">Este texto será visible para todos los alumnos en el dashboard</p>
                            </div>
                        </div>
                    </div>

                    <div className="pt-8 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="text-xs font-bold text-slate-400 italic bg-slate-50 px-4 py-2 rounded-full border border-slate-100">
                             ⚠️ Los campos con (*) son obligatorios
                        </div>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="group relative flex items-center justify-center gap-3 bg-gradient-to-br from-[#1e3a8a] to-[#0f172a] hover:from-blue-900 hover:to-slate-900 text-white px-10 py-4 rounded-2xl font-black uppercase tracking-[0.15em] transition-all disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-95 shadow-xl shadow-blue-900/20"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="animate-spin" size={20} />
                                    <span>Procesando Ejecución...</span>
                                </>
                            ) : (
                                <>
                                    <div className="p-1 bg-white/10 rounded-lg group-hover:bg-white/20 transition-colors">
                                        <Send size={18} />
                                    </div>
                                    <span>Ejecutar Reprogramación</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default MassRescheduleForm;
