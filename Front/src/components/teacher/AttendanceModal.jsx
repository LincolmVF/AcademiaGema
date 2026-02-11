import React from 'react';
import { X, Check, UserMinus } from 'lucide-react';
import { asistenciaService } from '../../services/asistencia.service';
import toast from 'react-hot-toast';

const AttendanceModal = ({ clase, onClose, onRefresh }) => {
    
    // Función para disparar el PATCH al backend
    const handleUpdate = async (asistenciaId, nuevoEstado) => {
        try {
            await asistenciaService.marcarAsistencia(asistenciaId, nuevoEstado);
            toast.success(`Estado actualizado a ${nuevoEstado}`);
            onRefresh(); // Refresca la lista en el Dashboard para ver los cambios
        } catch (error) {
            toast.error("Error al actualizar la asistencia");
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
            <div className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-zoom-in">
                
                {/* Header con estilo Gema */}
                <div className="bg-[#1e3a8a] p-8 text-white flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-black uppercase italic leading-none">
                            Control de Asistencia
                        </h2>
                        <p className="text-blue-200 text-xs font-bold uppercase tracking-widest mt-2 italic">
                            {clase.niveles_entrenamiento.nombre} · {clase.hora_inicio}
                        </p>
                    </div>
                    <button onClick={onClose} className="hover:bg-white/10 p-2 rounded-xl transition-colors">
                        <X size={24} />
                    </button>
                </div>

                {/* Lista de Estudiantes mapeada desde inscripciones */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                    {clase.inscripciones?.map((ins) => {
                        // Extraemos el registro de asistencia de hoy (array de 1 elemento según tu service)
                        const registro = ins.registros_asistencia[0];
                        
                        return (
                            <div key={ins.id} className="flex items-center justify-between p-5 bg-slate-50 rounded-3xl border border-slate-100 hover:border-blue-200 transition-all">
                                <div>
                                    <p className="font-black text-[#1e3a8a] uppercase text-sm tracking-tight">
                                        {ins.alumnos.usuarios.nombres} {ins.alumnos.usuarios.apellidos}
                                    </p>
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                        DNI: {ins.alumnos.usuarios.numero_documento}
                                    </span>
                                </div>

                                <div className="flex gap-3">
                                    {/* Botón Presente */}
                                    <button
                                        onClick={() => handleUpdate(registro.id, 'PRESENTE')}
                                        className={`p-3 rounded-2xl transition-all shadow-sm ${
                                            registro?.estado === 'PRESENTE' 
                                            ? 'bg-green-500 text-white shadow-green-200' 
                                            : 'bg-white text-slate-300 border border-slate-200 hover:border-green-500 hover:text-green-500'
                                        }`}
                                    >
                                        <Check size={20} strokeWidth={3} />
                                    </button>

                                    {/* Botón Falta */}
                                    <button
                                        onClick={() => handleUpdate(registro.id, 'FALTA')}
                                        className={`p-3 rounded-2xl transition-all shadow-sm ${
                                            registro?.estado === 'FALTA' 
                                            ? 'bg-red-500 text-white shadow-red-200' 
                                            : 'bg-white text-slate-300 border border-slate-200 hover:border-red-500 hover:text-red-500'
                                        }`}
                                    >
                                        <UserMinus size={20} strokeWidth={3} />
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default AttendanceModal;