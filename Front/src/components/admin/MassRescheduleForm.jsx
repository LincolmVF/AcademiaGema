import React, { useState, useEffect } from 'react';
import { CalendarRange, Send, AlertTriangle, Loader2 } from 'lucide-react';
import apiFetch from '../../interceptors/api';
import { API_ROUTES } from '../../constants/apiRoutes';
import toast from 'react-hot-toast';

const MassRescheduleForm = () => {
    const [horarios, setHorarios] = useState([]);
    const [isLoadingHorarios, setIsLoadingHorarios] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        horario_origen_id: '',
        fecha_origen: '',
        fecha_destino: '',
        motivo: ''
    });

    useEffect(() => {
        fetchHorarios();
    }, []);

    const fetchHorarios = async () => {
        try {
            const response = await apiFetch.get(API_ROUTES.HORARIOS.ACTIVOS);
            const json = await response.json();
            setHorarios(json.data || json || []);
        } catch (error) {
            console.error('Error fetching horarios:', error);
            toast.error('No se pudieron cargar los horarios disponibles.');
        } finally {
            setIsLoadingHorarios(false);
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

        // Validación frontend del día de la semana
        const horarioSeleccionado = horarios.find(h => h.id === parseInt(formData.horario_origen_id));
        if (horarioSeleccionado) {
            // Recrear fechas de forma segura neutralizando Zonas Horarias
            const fechaO = new Date(formData.fecha_origen);
            fechaO.setHours(12, 0, 0, 0);
            
            const diaViernesEs5DomingoEs0 = fechaO.getUTCDay(); // 0 is Sunday
            const diaOrigen = diaViernesEs5DomingoEs0 === 0 ? 7 : diaViernesEs5DomingoEs0;

            if (diaOrigen !== horarioSeleccionado.dia_semana) {
                toast.error(`La Fecha Original seleccionada no es un ${diasSemana[horarioSeleccionado.dia_semana]}. El horario seleccionado solo ocurre los ${diasSemana[horarioSeleccionado.dia_semana]}s.`);
                return;
            }
        }

        setIsSubmitting(true);

        try {
            const response = await apiFetch.post(API_ROUTES.CLASES.REPROGRAMAR_MASIVO, {
                horario_origen_id: parseInt(formData.horario_origen_id),
                fecha_origen: formData.fecha_origen,
                fecha_destino: formData.fecha_destino,
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

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg mb-6">
                <div className="flex">
                    <div className="flex-shrink-0">
                        <AlertTriangle className="h-5 w-5 text-yellow-400" />
                    </div>
                    <div className="ml-3">
                        <p className="text-sm text-yellow-700">
                            <strong>Atención:</strong> Esta acción modificará permanentemente las asistencias de todos los alumnos inscritos en el horario seleccionado. Asegúrate de verificar las fechas antes de continuar.
                        </p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Horario Selector */}
                <div className="col-span-1 md:col-span-2">
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Horario Afectado *</label>
                    <select
                        name="horario_origen_id"
                        value={formData.horario_origen_id}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all"
                        disabled={isLoadingHorarios}
                        required
                    >
                        <option value="">Selecciona el horario a reprogramar</option>
                        {horarios.map(h => (
                            <option key={h.id} value={h.id}>
                                {`Día: ${diasSemana[h.dia_semana]} | ${h.hora_inicio.substring(0,5)} - ${h.hora_fin.substring(0,5)} | Nivel: ${h.nivel?.nombre || 'General'} | Sede: ${h.cancha?.sede?.nombre} (${h.cancha?.nombre})`}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Date Picker - Origen */}
                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Fecha Original (Día que falló) *</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <CalendarRange size={18} className="text-slate-400" />
                        </div>
                        <input
                            type="date"
                            name="fecha_origen"
                            value={formData.fecha_origen}
                            onChange={handleChange}
                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all"
                            required
                        />
                    </div>
                    <p className="text-xs text-slate-500 mt-1">El día exacto que corresponde a la clase suspendida.</p>
                </div>

                {/* Date Picker - Destino */}
                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Nueva Fecha (Día de reposición) *</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <CalendarRange size={18} className="text-slate-400" />
                        </div>
                        <input
                            type="date"
                            name="fecha_destino"
                            value={formData.fecha_destino}
                            onChange={handleChange}
                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all"
                            required
                        />
                    </div>
                    <p className="text-xs text-slate-500 mt-1">A qué día se están pasando los alumnos.</p>
                </div>

                {/* Motivo */}
                <div className="col-span-1 md:col-span-2">
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Motivo Institucional *</label>
                    <textarea
                        name="motivo"
                        value={formData.motivo}
                        onChange={handleChange}
                        rows="3"
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all resize-none"
                        placeholder="Ej. Mantenimiento del recinto deportivo, Ausencia de profesor por fuerza mayor..."
                        required
                    ></textarea>
                     <p className="text-xs text-slate-500 mt-1">Este motivo se envía como notificación al Dashboard de los alumnos afectados.</p>
                </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end">
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex items-center gap-2 bg-[#1e3a8a] hover:bg-blue-900 text-white px-8 py-3 rounded-xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-95 shadow-lg shadow-blue-900/30"
                >
                    {isSubmitting ? (
                        <>
                            <Loader2 className="animate-spin" size={20} />
                            <span>Procesando...</span>
                        </>
                    ) : (
                        <>
                            <Send size={20} />
                            <span>Ejecutar Reprogramación Masiiva</span>
                        </>
                    )}
                </button>
            </div>
        </form>
    );
};

export default MassRescheduleForm;
